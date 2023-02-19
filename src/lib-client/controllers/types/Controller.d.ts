import { AxiosError, AxiosRequestConfig } from 'axios';
import { UseMutationOptions, UseQueryOptions } from 'react-query';
import { DeepPartial } from 'react-hook-form/dist/types';
import { Controller } from 'react-hook-form';
import { PrismaModelNames } from 'lib-server/prisma';
import {
  CompleteComment,
  CompletePost,
  CompleteProject,
  CompleteSubTask,
  CompleteTask,
  CompleteTaskStatus,
  CompleteUser,
  CompleteUserRole,
} from 'prisma/zod';
import { Example } from '@prisma/client';

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
  model: PrismaModelNames;
  query: writeQuery;
}

export interface ICustomUseMutationOptions<
  TModel,
  TMode extends mutationMode = mutationMode
> extends UseMutationOptions<
    TModel,
    AxiosError,
    { data?: DeepPartial<TModel>; where?: any } | DeepPartial<TModel>,
    unknown
  > {
  mode?: TMode;
  invalidateClientChanges?: boolean;
  changeUiKey?: string | string[];
  getChangeUiKey?: (config: any) => string | string[];
  changeUiType?: 'array' | 'object' | 'reorder';
  logConfig?: boolean;
  logMutationFnData?: boolean;
  model: PrismaModelNames;
  query: writeQuery;
}

type QueryOptions = anyQuery | 'anyWriteQuery' | 'anyReadQuery';
type ModelOptions = PrismaModelNames | 'anyModel';

export type IQueryConfig<
  TModel extends Record<string, any> = Record<string, any>,
  TQueryOptions extends QueryOptions = QueryOptions,
  TQuery extends TQueryOptions = TQueryOptions
> = {
  // condtionally assign config type based on query type
  [TQuery in TQueryOptions]?: TQuery extends readQuery | 'anyReadQuery'
    ? Partial<ICustomUseQueryOptions<Partial<TModel>>>
    : TQuery extends writeQuery | 'anyWriteQuery'
    ? Partial<ICustomUseMutationOptions<Partial<TModel>>>
    : 'query not found!';
};

export type IPartialQueryConfigs<
  TModels extends Record<ModelOptions, Record<string, any>>,
  TModelName extends ModelOptions = ModelOptions
> = {
  [TModelName in ModelOptions]?: IQueryConfig<TModels[TModelName]>;
};

export type GetPrismaModelType<TModelName extends PrismaModelNames> =
  PrismaModelNamesToTypes[TModelName];
