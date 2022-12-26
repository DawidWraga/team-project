import { AxiosError, AxiosRequestConfig } from 'axios';
import { axios } from 'lib-server/axios';
import { prefetchQuery } from 'lib-client/controllers/prefetchQuery';
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
import { DeepPartial } from 'react-hook-form/dist/types';
import { PrismaModelNames } from 'lib-server/prisma';
import { IReqBody } from 'lib-server/apiControllers/BaseApiController';
import { QUERY_STALE_TIME } from 'lib-client/constants';

export type IOperations = 'findMany' | 'findUnique' | 'create' | 'update' | 'delete';

const defaultOperations = {
  findMany: {},
  findUnique: {},
  create: {},
  update: {},
  delete: {},
};

interface ICreateControllerProps {
  model: PrismaModelNames;
  operationOptions?: {
    [key in IOperations]?: {
      test?: string;
    };
  };
}

interface IPrismaAxiosConfig extends AxiosRequestConfig<any> {
  data?: Partial<IReqBody>;
}

export type ICustomFetcher = (config?: IPrismaAxiosConfig) => Promise<any>;

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

interface IControlWrite<
  TData = unknown,
  TError = unknown,
  TVariables = { data?: DeepPartial<TData>; where?: any } | DeepPartial<TData>,
  TContext = unknown
> extends IControl {
  use: (
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ) => UseMutationResult<TData, TError, TVariables, TContext>;
}

export type readOperations = 'findMany' | 'findUnique';
export type writeOperations = 'update' | 'delete' | 'create';

interface IController<TModel = unknown> {
  findMany: IControlRead<TModel[], AxiosError, TModel[]>;
  findUnique: IControlRead<TModel, AxiosError, TModel>;
  create: IControlWrite<TModel, AxiosError>;
  update: IControlWrite<TModel, AxiosError>;
  delete: IControlWrite<TModel, AxiosError>;
}

export const createController = <TModel = unknown>({
  model,
  operationOptions = defaultOperations,
}: ICreateControllerProps): IController<TModel> => {
  const url = `/api/${model}`;
  const controller = {} as IController<TModel>;

  Object.entries(operationOptions).forEach(([operation, option]) => {
    const key = [model, operation];

    // consider moving defaults to props
    const fetcher = async (config?: AxiosRequestConfig<any>) => {
      const res = await axios({
        method: 'POST',
        url,
        ...config,
        data: { operation, ...config?.data },
      });

      return res.data;
    };

    if (operation.includes('find')) {
      //==================QUERIES===============
      const prefetch = prefetchQuery(key, fetcher as () => Promise<any>);

      const use = (
        { prismaProps, fetcherConfig, ...options } = {} as IControlUseQueryProps<TModel>
      ) => {
        return useQuery({
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          queryKey: key as any,
          staleTime: QUERY_STALE_TIME,
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
      } as any;
    } else {
      //==================MUTATIONS===============
      const use = (options?: UseMutationOptions<TModel>) => {
        const queryClient = useQueryClient();

        return useMutation<TModel>({
          mutationKey: [model, operation],
          mutationFn: (data: any) =>
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
      } as any;
    }
  });

  return controller;
};
