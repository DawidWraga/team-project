import { AxiosError, AxiosRequestConfig } from 'axios';
import { axios } from 'lib-server/axios';
import { prefetchQuery } from 'lib-client/controllers/prefetchQuery';
import { UseMutationResult, useMutation, useQuery, useQueryClient } from 'react-query';
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
} from 'lib-client/controllers/types/Controller';
import { useChangeQueryState } from 'lib-client/controllers/getUiChangeHandlers';

/**
 * Client side controller for sending query/mutation requests to ApiController.
 * 1. Client side event (view) triggers useQuery or useMutation function call
 * 2. Controller sends requests to ApiController
 * 3. Controller receives response from ApiController
 * 4. Controller provides services to client/view
 *
 * @param model prisma model which controller targets. Api route = api/model
 * @param customQueryConfigs config objects to customize default behaviour;
 * key = query name (or 'default'); value = config object.
 * Priority: function args > customQueryConfigs > baseQueryConfigs
 * (default will be selected if no config for specific query)
 */
export class Controller<TModel> {
  constructor(
    public model: PrismaModelNames,
    public customQueryConfigs?: IPartialQueryConfigs<TModel>
  ) {}
  public url: string = `/api/${this.model}`;
  public async fetcher(config?: Partial<AxiosRequestConfig<any>>) {
    const res = await axios({
      method: 'POST',
      url: this.url,
      ...config,
    });

    return res.data;
  }
  public useQuery<
    TQuery extends readQuery,
    TData = TQuery extends 'findMany' ? TModel[] : TModel
  >(
    query: TQuery,
    options?: ICustomUseQueryOptions<TData>
    /**
     * hook for fetching read queries from ApiController
     */
  ) {
    // get most relevant config
    const config = this.getConfig(query, options).useQueryOptions;

    const { prismaProps, fetcherConfig, logConfig, ...useQueryOptions } = config;

    const getQueryKey = () => {
      const queryKey: any = [this.model, query];
      if (prismaProps && Object.keys(prismaProps).length)
        // enables automatic refresh when prismaProps change eg filtering
        queryKey.push({
          prismaProps,
        });
      return queryKey;
    };

    return useQuery<TData, AxiosError, TData, any>({
      queryKey: getQueryKey(),
      queryFn: ({ queryKey }: any) => {
        return this.fetcher({
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
  public useMutation<TMode extends mutationMode = mutationMode>(
    query: writeQuery,
    options?: ICustomUseMutationOptions<TModel, TMode>
    /**
     * hook for handling write queries & their state to ApiController
     * @return {
     * 	mutate - post write query to ApiController
     *  mutateAsync - asyncronously post write query to ApiController
     * }
     *
     */
  ) {
    // get most relevant config
    const config = this.getConfig(query, options).useMutationOptions;
    const {
      mode,
      changeUiKey,
      invalidateClientChanges,
      includeResourceId,
      logConfig,
      logMutationFnData,
      ...useMutationOptions
    } = config;

    const queryClient = useQueryClient();
    const { pushChangedUiData, getChangedData, resetChangedData } = useUiChangeStore();

    const { changeQueryState } = useChangeQueryState({
      changeUiKey,
      query: query as any,
    });

    const { resourceId } = useUserStore();

    // create query funtion for Api controller
    const queryApiController = (prismaProps: any) =>
      this.fetcher({
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
      TModel,
      AxiosError,
      { data?: DeepPartial<TModel>; where?: any } | DeepPartial<TModel>,
      any
    >({
      mutationKey: [this.model, query] as any,
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
          console.log('changed ui data', changedUiData);
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
          await queryClient.invalidateQueries([this.model]); //triggers refetch
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
  public prefetchQuery(query: readQuery) {
    // prefetch query data for Nextj.js server side rendering (SSR/SSR/ISR)
    return prefetchQuery([this.model, query], () => this.fetcher({ data: query }));
  }
  getConfig<
    TQuery extends anyQuery,
    TData = TQuery extends 'findMany' ? TModel[] : TModel, //array if findMany
    TConfig = TQuery extends readQuery
      ? Partial<ICustomUseQueryOptions<TData>>
      : Partial<ICustomUseMutationOptions<TData, mutationMode>>
  >(query: TQuery, functionCallOptions?: TConfig) {
    /**
     * merges configs to select most specific and fallback to highest possible specificity
     */

    const _functionCallOptions =
      functionCallOptions &&
      (query.includes('find')
        ? { useQueryOptions: functionCallOptions }
        : { useMutationOptions: functionCallOptions });

    const mergedConfig = mergeDeep(
      // least specific therefore will be overwritten if possible
      this.baseQueryConfigs?.default && this.baseQueryConfigs?.default,
      this.customQueryConfigs?.default && this.customQueryConfigs?.default,
      this.baseQueryConfigs?.[query] && this.baseQueryConfigs?.[query],
      this.customQueryConfigs?.[query] && this.customQueryConfigs?.[query],
      _functionCallOptions
      // most specific therefore will be prioritised if available
    ) as IQueryConfig<TModel>;

    // log for debugging
    if (
      mergedConfig.useQueryOptions.logConfig ||
      mergedConfig.useMutationOptions.logConfig
    ) {
      console.log(`LOG ${this.model} ${query} mergedConfig: `, mergedConfig);
    }

    return mergedConfig;
  }
  baseQueryConfigs: IPartialQueryConfigs<TModel> = {
    default: {
      useMutationOptions: {
        mode: 'server',
        invalidateClientChanges: false,
        changeUiKey: [this.model, 'findMany'],
        logConfig: false,
      },
      useQueryOptions: {
        prismaProps: {},
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        logConfig: false,
        staleTime: 5 * 60 * 1000, //min*sec*ms,
      },
    },
  };
}
