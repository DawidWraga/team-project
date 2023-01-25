import { AxiosError, AxiosRequestConfig } from 'axios';
import { UseMutationOptions, UseQueryOptions } from 'react-query';
import { DeepPartial } from 'react-hook-form/dist/types';
import { Controller } from 'react-hook-form';

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
type anyObj = Record<string, any>;
export interface IRequestData extends anyObj {
  query: anyQuery;
  prismaProps: anyObj;
}
export interface IPrismaAxiosConfig extends AxiosRequestConfig<any> {
  data?: Partial<IRequestData>;
}

export type ICustomFetcher = (config?: IPrismaAxiosConfig) => Promise<any>;

export type mutationMode = 'server' | 'optimistic' | 'changeUi' | 'saveUiChanges';

export interface ICustomUseQueryOptions<TModel>
  extends UseQueryOptions<TModel, AxiosError, TModel, any> {
  prismaProps?: Record<string, any>;
  fetcherConfig?: AxiosRequestConfig<any>;
  logConfig?: boolean;
}

export interface ICustomUseMutationOptions<TModel, TMode>
  extends UseMutationOptions<
    TModel,
    AxiosError,
    { data?: DeepPartial<TModel>; where?: any } | DeepPartial<TModel>,
    unknown
  > {
  mode?: TMode;
  invalidateClientChanges?: boolean;
  changeUiKey?: string | string[];
  includeResourceId?: boolean;
  logConfig?: boolean;
  logMutationFnData?: boolean;
}

export interface IQueryConfig<TModel> {
  useQueryOptions: ICustomUseQueryOptions<TModel>;
  useMutationOptions: ICustomUseMutationOptions<TModel, mutationMode>;
}
export type IPartialQueryConfigs<TModel> = Partial<
  Record<anyQuery | 'default', Partial<IQueryConfig<TModel>>>
>;
