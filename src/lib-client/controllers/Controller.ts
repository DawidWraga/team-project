import { AxiosError, AxiosRequestConfig } from 'axios';
import { axios } from 'lib-server/axios';
import { prefetchQuery } from 'lib-client/controllers/prefetchQuery';
import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { DeepPartial } from 'react-hook-form/dist/types';
import { PrismaModelNames } from 'lib-server/prisma';
import { useUiChangeStore } from 'lib-client/stores/UiChangeStore';
import { useUserStore } from 'lib-client/stores/UserStore';
import { mergeDeep } from 'utils/deepMerge';
import type {
  IPartialQueryConfigs,
  IQueryConfig,
  readQuery,
  writeQuery,
  ICustomUseQueryOptions,
  mutationMode,
  ICustomUseMutationOptions,
  anyQuery,
  PrismaModelNamesToTypes,
  GetPrismaModelType,
  ModelOptions,
} from 'lib-client/controllers/types/Controller';
import { useChangeQueryState } from 'lib-client/controllers/getUiChangeHandlers';

/**
 * Client side controller. Handles sending query/mutation requests to ApiController.
 *
 * @param model prisma model which controller targets. Api route = api/model
 * @param customQueryConfigs config objects to customize default behaviour;
 * key = query name (or 'default'); value = config object.
 * Priority: function args > customQueryConfigs > baseQueryConfigs
 * (default will be selected if no config for specific query)
 */
export class Controller {
  getUrl = (config: any) => `/api/${config.model}`;
  getFetcher =
    (config: any) => async (fetcherConfig?: Partial<AxiosRequestConfig<any>>) => {
      const res = await axios({
        method: 'POST',
        url: this.getUrl(config),
        ...fetcherConfig,
      });

      return res.data;
    };
  public useQuery<
    TQuery extends readQuery,
    TModelName extends PrismaModelNames,
    TData = TQuery extends 'findMany'
      ? GetPrismaModelType<TModelName>[]
      : GetPrismaModelType<TModelName>
  >(
    options: Omit<ICustomUseQueryOptions<TData>, 'model' | 'query'> & {
      query: TQuery;
      model: TModelName;
    }
  ) {
    // get most relevant config
    const config = this.getConfig(options);
    const fetcher = this.getFetcher(config);

    const { prismaProps, fetcherConfig, logConfig, query, model, ...useQueryOptions } =
      config;

    // construct standardised default query key based on query options
    // starting with model name enables predictable key for query invalidation
    const getQueryKey = () => {
      const queryKey: any = [model, query];
      if (prismaProps && Object.keys(prismaProps).length) {
        // enables automatic refresh when prismaProps change eg filtering
        queryKey.push({
          prismaProps,
        });
      }
      return queryKey;
    };

    return useQuery<TData, AxiosError, TData, any>({
      queryKey: getQueryKey(),
      queryFn: ({ queryKey }: any) => {
        return fetcher({
          ...fetcherConfig,
          data: {
            query,
            ...fetcherConfig?.data,
            prismaProps,
          },
        });
      },
      // enabled: isHydrated,
      ...useQueryOptions,
    });
  }

  /**
   * hook for handling write queries & their state to ApiController
   * @return {
   * 	mutate - post write query to ApiController
   *  mutateAsync - asyncronously post write query to ApiController
   * }
   *
   */
  // "Nested" is used to differenciate between between parent TModel & Tmodel specific to useMutation
  public useMutation<
    TModelName extends PrismaModelNames = PrismaModelNames,
    TModelNested = GetPrismaModelType<TModelName>,
    TMode extends mutationMode = mutationMode
  >(
    options: ICustomUseMutationOptions<TModelNested, TMode> & {
      model: TModelName;
      query: writeQuery;
    }
  ) {
    // get most relevant config
    const config = this.getConfig(options);
    const fetcher = this.getFetcher(config);
    let {
      mode,
      changeUiKey,
      invalidateClientChanges,
      includeResourceId,
      logConfig,
      logMutationFnData,
      changeUiType,
      query,
      model,
      getChangeUiKey,
      ...useMutationOptions
    } = config;

    if (!changeUiKey?.length) changeUiKey = getChangeUiKey?.(config) || [model, query];

    const queryClient = useQueryClient();
    const { pushChangedUiData, getChangedData, resetChangedData } = useUiChangeStore();

    const { changeQueryState } = useChangeQueryState({
      changeUiKey,
      query,
      changeUiType,
    } as any);

    const { resourceId } = useUserStore();

    // create query funtion for Api controller
    const queryApiController = (prismaProps: any) =>
      fetcher({
        data: {
          query,
          prismaProps: {
            ...prismaProps,
            ...(includeResourceId && {
              resourceId,
            }),
          },
        },
      });

    const useMutationReturn = useMutation<
      TModelNested,
      AxiosError,
      { data?: DeepPartial<TModelNested>; where?: any } | DeepPartial<TModelNested>,
      any
    >({
      mutationKey: [model, query] as any,
      mutationFn: async (data: any) => {
        // send mutation request to ApiController
        if (logMutationFnData) {
          console.log('LOG mutationFn data: ', data);
        }
        if (mode === 'server' || mode === 'optimistic') {
          return queryApiController(data);
        }

        // change client state without sending request to ApiController
        if (mode === 'changeUi') {
          pushChangedUiData(changeUiKey!, query, data);
          return data;
        }

        // send mutation request with all client side changes to ApiController
        if (mode === 'saveUiChanges') {
          const changedUiData = getChangedData(changeUiKey!, query);
          if (!changedUiData) return;
          // console.log('changed ui data', changedUiData);
          // runs all saved mutation functions in parallel
          const res = await Promise.all(
            changedUiData.map(async (data) => {
              if (query === 'create' && data.id) delete data.id;
              const res = await queryApiController(data);
              return res;
            })
          );
          resetChangedData(changeUiKey!, query);
          return res;
        }
      },
      onMutate: async (newItem: any) => {
        // ======= change client side data logic ======
        if (mode === 'changeUi' || mode === 'optimistic') {
          const { previousState } = await changeQueryState({ newItem });
          return previousState;
        }
      },
      onError: (err, newItem, context: any) => {
        // if error revert to previous state
        if (mode === 'optimistic') {
          queryClient.setQueryData(changeUiKey!, context.previousState);
        }
      },
      // ======== invalidate query to trigger refetch =======
      onSettled: () => {
        if (mode === 'optimistic' && invalidateClientChanges) {
          queryClient.invalidateQueries({ queryKey: changeUiKey });
        }
      },
      onSuccess: async (...args) => {
        if (mode === 'server' || (mode === 'saveUiChanges' && invalidateClientChanges)) {
          await queryClient.invalidateQueries([model]); //triggers refetch
        }

        if (useMutationOptions?.onSuccess) useMutationOptions?.onSuccess(...args);
      },
      ...useMutationOptions,
    });

    // if saveUiChanges mode, mutate & mutateAsync do not need any args
    return useMutationReturn as TMode extends 'saveUiChanges'
      ? Omit<
          UseMutationResult<never, AxiosError, never, any>,
          'mutate' | 'mutateAsync'
        > & {
          mutate: () => void;
          mutateAsync: () => Promise<any>;
        }
      : typeof useMutationReturn;
  }
  // prefetch query data for Nextj.js server side rendering (SSR/SSR/ISR)
  public prefetchQuery(options: { model: PrismaModelNames; query: readQuery }) {
    const fetcher = this.getFetcher(options);
    const { model, query } = options;
    return prefetchQuery([model, query], () => fetcher({ data: query }));
  }

  public use<
    TModelName extends PrismaModelNames = PrismaModelNames,
    TQuery extends anyQuery = anyQuery,
    TData = TQuery extends writeQuery
      ? GetPrismaModelType<TModelName>
      : TQuery extends 'findMany'
      ? GetPrismaModelType<TModelName>[]
      : GetPrismaModelType<TModelName>,
    TMode extends mutationMode = 'server'
  >(
    options: (TQuery extends readQuery
      ? Omit<ICustomUseQueryOptions<TData>, 'query' | 'model'>
      : Omit<ICustomUseMutationOptions<TData, TMode>, 'query' | 'model'>) & {
      model: TModelName;
      query: TQuery;
    }
  ) {
    const { query } = options;

    if (query.includes('find')) {
      type Query = TQuery extends readQuery ? TQuery : never;
      type MultiQuery = Query extends 'findMany' ? 'findMany' : never;
      const useQueryReturn = this.useQuery<MultiQuery, TModelName>(options as any);

      return useQueryReturn as TQuery extends readQuery ? typeof useQueryReturn : never;
    } else {
      return this.useMutation<TModelName, GetPrismaModelType<TModelName>, TMode>(
        options as any
      );
    }
  }

  getConfig<
    TQuery extends anyQuery = anyQuery,
    TData = TQuery extends 'findMany' ? Record<string, any>[] : Record<string, any>, //array if findMany
    TConfig = TQuery extends readQuery
      ? Partial<ICustomUseQueryOptions<TData>>
      : Partial<ICustomUseMutationOptions<TData, mutationMode>>
  >(functionCallOptions: TConfig & { query: TQuery; model: PrismaModelNames }): TConfig {
    const { model, query } = functionCallOptions;
    const isReadQuery = query.includes('find');
    const anyQuery = isReadQuery ? 'anyReadQuery' : 'anyWriteQuery';

    const mergedConfig = mergeDeep(
      // least specific therefore will be overwritten if possible
      this.queryConfigs?.['anyModel']?.[anyQuery],
      this.queryConfigs?.['anyModel']?.[query],
      this.queryConfigs?.[model]?.[anyQuery],
      this.queryConfigs?.[model]?.[query],
      functionCallOptions
      // most specific therefore will be prioritised if available
    );

    // log for debugging
    if (mergedConfig.logConfig) {
      console.log(`LOG ${model} ${query} mergedConfig: `, mergedConfig);
    }

    return mergedConfig;
  }
  queryConfigs: IPartialQueryConfigs<PrismaModelNamesToTypes> = {
    anyModel: {
      anyWriteQuery: {
        mode: 'server',
        invalidateClientChanges: false,
        getChangeUiKey: (config) => [config.model, 'findMany'],
        logConfig: false,
      },
      anyReadQuery: {
        prismaProps: {},
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        logConfig: false,
        staleTime: 5 * 60 * 1000, //min*sec*ms,
      },
      create: {},
    },
    task: {
      anyReadQuery: {},
    },
  };
}

export const controller = new Controller();

// export function ControllerWrapper (props: )

export function ControllerWrapper<
  TQuery extends anyQuery = anyQuery,
  TModelName extends PrismaModelNames = PrismaModelNames,
  TData = GetPrismaModelType<TModelName>,
  TOptions = TQuery extends readQuery
    ? ICustomUseQueryOptions<TData>
    : ICustomUseMutationOptions<TData>
>({
  children,
  ...props
}: {
  children: (props: any) => JSX.Element;
  query: TQuery;
  model: TModelName;
} & TOptions) {
  const controllerReturn = controller.use(props);
  return children(controllerReturn);
}
