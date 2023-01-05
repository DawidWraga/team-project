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
import { useState } from 'react';
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
  optimistic?: boolean;
}

interface IControlWrite<
  TData = unknown,
  TError = unknown,
  TVariables = { data?: DeepPartial<TData>; where?: any } | DeepPartial<TData>,
  TContext = unknown
> extends IControl {
  use: (
    options?: UseMutationOptionsCustom<TData, TError, TVariables, TContext>
  ) => UseMutationResult<TData, TError, TVariables, TContext> & {
    useSave: (options?: UseMutationOptions<TData, TError, TVariables, TContext>) => Omit<
      UseMutationResult<never, TError, TVariables, TContext>,
      'mutateAsync' | 'mutate'
    > & {
      mutateAsync: () => Promise<any>;
      mutate: () => any;
    };
    isSaved: boolean;
    unsavedChangesCount: number;
    changeUi: (data: TData) => void;
    saveUiChanges: () => Promise<any>;
  };
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

    // default options enable flexible configurations for scalability. Currently not needed.
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

      const use = ({
        optimistic,
        ...options
      }: UseMutationOptionsCustom<TModel, unknown, unknown, unknown> = {}) => {
        const queryClient = useQueryClient();
        // const [changedUiData, pushChangedUiData] = useState([]);
        const { pushChangedUiData, getChangedData, resetChangedData } =
          useUiChangeStore();

        const mutationReturn = useMutation<TModel, any, any, any>({
          mutationKey: key as any,
          mutationFn: ({ UI_ONLY, changeUiKey, SAVE_UI_CHANGES, ...data }: any) => {
            const fn = (d) => fetcher({ data: { query, prismaProps: { ...d } } });

            if (UI_ONLY) {
              console.log({ changeUiKey });
              pushChangedUiData(changeUiKey, query, data);
              return data;
            } else if (SAVE_UI_CHANGES) {
              const changedUiData = getChangedData(changeUiKey, query);

              // runs all saved mutation functions in parallel
              if (!changedUiData) return;
              const saveFn = async () => {
                const res = await Promise.any(
                  changedUiData.map(async (d) => {
                    const res = await fn(d);
                    return res;
                  })
                );
                resetChangedData(changeUiKey, query);
                return res;
              };
              return saveFn();
            } else {
              return fn(data);
            }
          },
          onMutate: async ({ UI_ONLY, ...newItem }: any) => {
            if (!optimistic && !UI_ONLY) return;

            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: [model, 'findMany'] });

            // Snapshot the previous value
            const previousState = queryClient.getQueryData([model, 'findMany']);

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

            // !!!change "key" to dependentQueryKey and assign value once (easier to chaneg in params eg findOne instead of findMany)
            queryClient.setQueryData([model, 'findMany'], handlers[query]);

            // Return a context object with the snapshotted value
            if (UI_ONLY) {
              // let uiChanges: any[];
              // const uiChanges = [...changedUiData, newItem];
              // pushChangedUiData(uiChanges);
              return { UI_ONLY: true };
            }

            return { previousState };
          },
          // If the mutation fails,
          // use the context returned from onMutate to roll back
          onError: (err, newItem, context: any) => {
            console.log('err');

            if (context?.UI_ONLY) return;
            if (!optimistic) return;

            queryClient.setQueryData([model, 'findMany'], context.previousState);
          },
          // Always refetch after error or success:
          onSettled: (data, error, variables, context: any) => {
            if (context?.UI_ONLY) return;

            // console.log('sutt');

            if (optimistic) {
              queryClient.invalidateQueries({ queryKey: [model, 'findMany'] });
            }
          },
          onSuccess: async (data, variables, context: any) => {
            if (context?.UI_ONLY) return;

            // console.log('succ');
            if (!optimistic) {
              await queryClient.invalidateQueries([model]);
            }

            if (options?.onSuccess) options?.onSuccess(data, variables, context);
          },
          ...options,
        });


        (mutationReturn as any).changeUi = async (
          data: any,
          queryKey: string | string[] = [model, 'findMany']
        ) => {
          return mutationReturn.mutateAsync({
            ...data,
            UI_ONLY: true,
            changeUiKey: queryKey,
          });
        };

        (mutationReturn as any).saveUiChanges = async (
          queryKey: string | string[] = [model, 'findMany']
        ) => {
          return mutationReturn.mutateAsync({
            SAVE_UI_CHANGES: true,
            changeUiKey: queryKey,
          });
        };

        return mutationReturn;
      };

      controller[query as writeQuery] = {
        use,
        fetcher,
      } as any;
    }
  });

  return controller;
};



        // if (mode === 'server' || mode === 'optimistic') return mutationReturn;

        // // runs all saved mutation functions in parallel
        // const saveFn = async () => {
        //   if (!savedMutations.length) return;
        //   const res = await Promise.any(
        //     savedMutations.map(async (fn) => {
        //       const res = await fn();
        //       return res;
        //     })
        //   );

        //   setSavedMutations([]);
        //   return res;
        // };

        // // ! unsaved changes are on original mutation return object. more useful to be on the useSave useMutation instead. eliminates issues w state management
        // (mutationReturn as any).useSave = (options: any) =>
        //   use({
        //     mode: 'server',
        //     mutationFn: saveFn as any,
        //     ...options,
        //   });

        // (mutationReturn as any).unsavedChangesCount = savedMutations.length;
        // (mutationReturn as any).isSaved = savedMutations.length === 0;

// on every mutation obj
// mutate, mutateAsync, changeUi, saveUiChanges
