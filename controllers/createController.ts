import { AxiosRequestConfig } from 'axios';
import { axios } from 'lib-server/axios';
import { prefetchQuery } from 'controllers/prefetchQuery';
import {
  DehydratedState,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
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
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
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
    const key = [model, operation];

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

    //==================QUERIES===============

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
          queryKey: key as any,
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
        use,
        fetcher,
        prefetch,
      } as IControlRead<TReadFnQueryData, TReadError, TReadData, TReadQueryKey>;
    } else {
      //==================MUTATIONS===============
      const use = (options?: UseMutationOptions<TData, TError, TVariables, TContext>) => {
        const queryClient = useQueryClient();

        return useMutation<TData, TError, TVariables, TContext>({
          mutationKey: [model, operation],
          mutationFn: (data) =>
            fetcher({ data: { operation, prismaProps: { ...data } } }),
          onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries([model]);
            if (options?.onSuccess) options?.onSuccess(data, variables, context);
          },
          ...options,
        });
      };

      controller[operation as writeOperations] = {
        use,
        fetcher,
      } as IControlWrite<TData, TError, TVariables, TContext>;
    }
  });

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
