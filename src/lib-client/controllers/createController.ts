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
import { useUiChangeStore } from 'lib-client/stores/UiChangeStore';

export type readQuery = 'findMany' | 'findUnique' | 'findFirst' | 'aggregate' | 'count';
export type writeQuery =
  | 'update'
  | 'delete'
  | 'create'
  | 'createMany'
  | 'updateMany'
  | 'upsert'
  | 'deleteMany';
export type anyQuery = readQuery | writeQuery;

interface ICreateControllerProps {
  model: PrismaModelNames;
  queries: anyQuery[];
  queryOptions?: Record<anyQuery, Record<any, any>>;
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

interface UseMutationOptionsCustom<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  mode?: 'server' | 'optimistic' | 'changeUi' | 'saveUiChanges';
  changeUiKey?: string | string[];
}

interface IControlWrite<
  TData = unknown,
  TError = unknown,
  TVariables = { data?: DeepPartial<TData>; where?: any } | DeepPartial<TData>,
  TContext = unknown
> extends IControl {
  use: <isSaveUiChanges>(
    options?: UseMutationOptionsCustom<TData, TError, TVariables, TContext>
  ) => isSaveUiChanges extends true
    ? Omit<
        UseMutationResult<never, TError, TVariables, TContext>,
        'mutateAsync' | 'mutate'
      > & {
        mutateAsync: () => Promise<any>;
        mutate: () => any;
      }
    : UseMutationResult<TData, TError, TVariables, TContext>;
}

interface IController<TModel = unknown> {
  findMany: IControlRead<TModel[], AxiosError, TModel[]>;
  findUnique: IControlRead<TModel, AxiosError, TModel>;
  create: IControlWrite<TModel, AxiosError>;
  update: IControlWrite<TModel, AxiosError>;
  delete: IControlWrite<TModel, AxiosError>;
}

export const createController = <TModel = unknown>({
  model,
  queries,
  queryOptions,
}: ICreateControllerProps): IController<TModel> => {
  const url = `/api/${model}`;
  const controller = {} as IController<TModel>;

  queries.forEach((query) => {
    const key = [model, query];

    // queryOptions enable flexible configurations for future extendability. Currently not needed.
    // const defaultOptions = queryOptions?.[query];

    // consider moving defaults to props
    const fetcher = async (config?: AxiosRequestConfig<any>) => {
      const res = await axios({
        method: 'POST',
        url,
        ...config,
        data: { query, ...config?.data },
      });

      return res.data;
    };

    if (query.includes('find')) {
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

      controller[query as readQuery] = {
        use,
        fetcher,
        prefetch,
      } as any;
    } else {
      //==================MUTATIONS===============

      const use = (
        {
          mode,
          changeUiKey,
          ...options
        }: UseMutationOptionsCustom<TModel, unknown, unknown, unknown> = {
          mode: 'server',
          changeUiKey: [model, 'findMany'],
        }
      ) => {
        if (!mode) mode = 'server';
        if (!changeUiKey) changeUiKey = [model, 'findMany'];

        const queryClient = useQueryClient();
        const { pushChangedUiData, getChangedData, resetChangedData } =
          useUiChangeStore();

        return useMutation<TModel, any, any, any>({
          mutationKey: key as any,
          mutationFn: async (data: any) => {
            const fn = (d) => fetcher({ data: { query, prismaProps: { ...d } } });

            if (mode === 'server' || mode === 'optimistic') {
              return fn(data);
            }

            if (mode === 'changeUi') {
              pushChangedUiData(changeUiKey, query, data);
              return data;
            }

            if (mode === 'saveUiChanges') {
              const changedUiData = getChangedData(changeUiKey, query);
              if (!changedUiData) return;

              // runs all saved mutation functions in parallel
              const res = await Promise.any(
                changedUiData.map(async (d) => {
                  const res = await fn(d);
                  return res;
                })
              );
              resetChangedData(changeUiKey, query);
              return res;
            }
          },
          onMutate: async (newItem: any) => {
            if (mode === 'server' || mode === 'saveUiChanges') return;

            // prevent refetches to stop them from overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: changeUiKey });

            // Snapshot the previous value
            const previousState = queryClient.getQueryData(changeUiKey);

            // Optimistically update to the new value
            const handlers = {
              update: (prev: any[]) => {
                const result = [...prev];
                result.splice(
                  result.findIndex((item) => item.id === newItem.id),
                  1,
                  newItem
                );
                return result;
              },
              delete: (prev: any[]) => {
                return [...prev].filter((item) => item.id !== newItem.id);
              },
            };

            queryClient.setQueryData(changeUiKey, handlers[query]);

            // Return a context object with the snapshotted value
            return { previousState };
          },
          onError: (err, newItem, context: any) => {
            // If the mutation fails,
            // use the context returned from onMutate to roll back
            if (mode === 'optimistic') {
              queryClient.setQueryData(changeUiKey, context.previousState);
            }
          },
          onSettled: (data, error, variables, context: any) => {
            // Always refetch after error or success:
            if (mode === 'optimistic') {
              queryClient.invalidateQueries({ queryKey: changeUiKey });
            }
          },
          onSuccess: async (data, variables, context: any) => {
            if (mode === 'server' || mode === 'saveUiChanges') {
              await queryClient.invalidateQueries([model]);
            }

            if (options?.onSuccess) options?.onSuccess(data, variables, context);
          },
          ...options,
        });
      };

      controller[query as writeQuery] = {
        use,
        fetcher,
      } as any;
    }
  });

  return controller;
};

//   (mutationReturn as any).changeUi = async (
//     data: any,
//     queryKey: string | string[] = [model, 'findMany']
//   ) => {
//     return mutationReturn.mutateAsync({
//       ...data,
//       UI_ONLY: true,
//       changeUiKey: queryKey,
//     });
//   };
