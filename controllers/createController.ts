import { AxiosRequestConfig } from 'axios';
import { axios } from 'lib-server/axios';
import { prefetchQuery } from 'controllers/prefetchQuery';
import {
  DehydratedState,
  QueryKey,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from 'react-query';
import { IUseCreateQueryProps, useCreateQuery } from 'controllers/useCreateQuery';
import {
  IUseCreateMutationProps,
  useCreateMutation,
} from 'controllers/useCreateMutation';
import { Prisma } from '@prisma/client';

export type IOperations = 'findMany' | 'findUnique' | 'create' | 'update' | 'delete';

const defaultOperations = {
  findMany: {},
  findUnique: {},
  create: {},
  update: {},
  delete: {},
};

interface ICreateControllerProps {
  model: Prisma.ModelName;
  operationOptions?: {
    [key in IOperations]?: {
      test?: string;
    };
  };
}

export type ICustomFetcher = (config?: AxiosRequestConfig<any>) => Promise<any>;

interface IControlUseQueryProps<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
  prismaProps?: { [key: string]: any };
  fetcherConfig?: AxiosRequestConfig<any>;
}

interface IControl {
  url: string;
  key: string;
  fetcher: ICustomFetcher;
}

interface IControlRead<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> extends IControl {
  use: (
    options?: IControlUseQueryProps<TQueryFnData, TError, TData, TQueryKey>
  ) => UseQueryResult<TData, TError>;
  prefetch: () => Promise<{
    props: {
      dehydratedState: DehydratedState;
    };
  }>;
}

interface IControlWrite<TData, TError, TVariables, TContext> extends IControl {
  use: (
    options?: IUseCreateMutationProps<TData, TError, TVariables, TContext>
  ) => UseMutationResult<TData, TError, TVariables, TContext>;
}

type readOperations = 'findMany' | 'findUnique';
type writeOperations = 'update' | 'delete' | 'create';

interface IController<
  TReadFnQueryData = unknown,
  TReadError = unknown,
  TReadData = TReadFnQueryData,
  TReadQueryKey extends QueryKey = QueryKey,
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown
> {
  url: string;
  findMany?: IControlRead<TReadFnQueryData, TReadError, TReadData, TReadQueryKey>;
  findUnique?: IControlRead<TReadFnQueryData, TReadError, TReadData, TReadQueryKey>;
  create?: IControlWrite<TData, TError, TVariables, TContext>;
  update?: IControlWrite<TData, TError, TVariables, TContext>;
  delete?: IControlWrite<TData, TError, TVariables, TContext>;
  apiHandler: any;
}

const urlStart = 'http://localhost:3000';

export const createController = <
  TReadFnQueryData = unknown,
  TReadError = unknown,
  TReadData = TReadFnQueryData,
  TReadQueryKey extends QueryKey = QueryKey,
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown
>({
  model,
  operationOptions = defaultOperations,
}: ICreateControllerProps): IController<
  TReadFnQueryData,
  TReadError,
  TReadData,
  TReadQueryKey,
  TData,
  TError,
  TVariables,
  TContext
> => {
  /**
   * api endpoint derived from model name
   **/
  const url = `${urlStart}/api/prisma`;
  // const url = `${urlStart}/api/${model.toLowerCase()}`;

  const controller = { url } as IController<
    TReadFnQueryData,
    TReadError,
    TReadData,
    TReadQueryKey,
    TData,
    TError,
    TVariables,
    TContext
  >;

  Object.entries(operationOptions).forEach(([operation, option]) => {
    const key = `${model}_${operation}`;

    const fetcher = async (config?: AxiosRequestConfig<any>) => {
      // try {
      const res = await axios({
        method: 'POST',
        url,
        ...config,
        data: { operation, model, ...config?.data },
      });

      return res.data;
      // } catch (e) {
      //   console.error(e);
      // }
    };

    if (operation.includes('find')) {
      const prefetch = prefetchQuery(key, fetcher as () => Promise<any>);

      const use = (
        { prismaProps, fetcherConfig, ...options } = {} as IControlUseQueryProps<
          TReadFnQueryData,
          TReadError,
          TReadData,
          TReadQueryKey
        >
      ) => {
        return useQuery({
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          queryKey: [model, operation] as any,
          queryFn: () =>
            fetcher({
              ...fetcherConfig,
              data: {
                ...fetcherConfig?.data,
                prismaProps,
              },
            }),
          ...options,
        });
      };

      controller[operation as readOperations] = {
        url,
        key,
        use,
        fetcher,
        prefetch,
      } as IControlRead<TReadFnQueryData, TReadError, TReadData, TReadQueryKey>;
    } else {
      const use = (
        options?: IUseCreateMutationProps<TData, TError, TVariables, TContext>
      ) =>
        useCreateMutation<TData, TError, TVariables, TContext>({
          mutationKey: [model, operation],
          mutationFn: (data) =>
            fetcher({ data: { operation, prismaProps: { ...data } } }),
          invalidateKeys: [model],
          ...options,
        });

      controller[operation as writeOperations] = {
        url,
        key,
        use,
        fetcher,
      } as IControlWrite<TData, TError, TVariables, TContext>;
    }
  });

  // ========= SERVER SIDE OPERATIONS (prisma) ======

  controller.apiHandler = async () => {
    const { apiHandler } = await import('lib-server/nc');
    const { apiValidate } = await import('lib-server/apiValidate');
    const prisma = await import('lib-server/prisma');

    const handler = apiHandler();

    const operationTohandler = Object.entries(operationOptions).map(
      ([operation, options]) =>
        async (body: any) => {
          return prisma[model as Prisma.ModelName][operation](body);
        }
    );

    handler.post(async (req, res) => {
      try {
        const { operation, ...restBody } = req.body;
        const data = await operationTohandler[operation](restBody);
        res.json(data);
      } catch (e) {
        res.status(400).send(e);
      }
    });

    // handler.get(async (req, res) => {});

    // Object.entries(writeOperationOptions).forEach(([operation, option]) => {
    // 	const method = operationToMethod[operation as IOperations];

    // 	handler[method.toLowerCase() as 'post' | 'put' | 'delete'](async () => {
    // 		// const data = prisma[model][operation]({});
    // 	});

    // 	// handler[method.toLowerCase()](async (req, res) => {

    // 	// 	const prisma = import('lib-server/prisma');

    // 	// 	const data = prisma[model][operation]({});
    // 	// };
    // });

    return handler;
  };

  return controller;
};

// return controller as IController<
// TReadFnQueryData,
// TReadError,
// TReadData,
// TReadQueryKey,
// TData,
// TError,
// TVariables,
// TContext
// >;
