import type { anyQuery } from 'lib-client/controllers/types/Controller';
import { getAxiosErrorMessage } from 'lib-server/axios';
import { apiHandler } from 'lib-server/nc';
import { prisma } from 'lib-server/prisma';
import { PrismaModelNames } from 'lib-server/prisma';
import { mergeDeep } from 'utils/deepMerge';
import { ZodAnyDef, z } from 'zod';

/**
 * Server side controller. Receives request from controller, executes prisma query, returns prisma result to controller.
 *
 * @param model prisma model which ApiController targets
 * @param customQueryConfigs config objects to customize default behaviour;
 * key = query name (or 'default'); value = config object.
 * Priority: customQueryConfigs > baseQueryConfigs
 * (default will be selected if no config for specific query)
 */

export class ApiController<TModel> {
  private currentQuery: anyQuery;
  constructor(
    public model: PrismaModelNames,
    public customQueryConfigs?: IPartialQueryConfigs<TModel>
  ) {}
  public handler = apiHandler().post(async (req, res) => {
    try {
      const { query, prismaProps }: IRequestData<TModel> = req.body;

      this.currentQuery = query;

      // get handlers for specific query
      const config = this.getConfig(query, prismaProps);
      const { queryFn, guard, logDataBeforeQuery } = config;

      // guard clause for validation
      const errorMessage = guard(req.body);
      if (typeof errorMessage === 'string') {
        throw new Error('Request failed.', { cause: errorMessage });
      }

      // log for debugging
      if (logDataBeforeQuery) {
        console.log({
          model: this.model,
          query,
          prismaProps,
          queryConfig: config,
          queryFn,
        });
      }

      // run prisma query
      const data = await queryFn(prismaProps);

      res.send(data);
    } catch (e: any) {
      res.status(400).send(getAxiosErrorMessage(e));
    }
  });

  /**
   *
   * @param query
   *
   * @param options
   * @return config object for specific query
   *
   * @description merges configs to select most specific and fallback to highest possible specificity
   */

  getConfig(query: anyQuery, options?: Record<any, any>): IQueryConfig<TModel> {
    /**
     * merges configs to select most specific and fallback to highest possible specificity
     least specific therefore will be overwritten if possible
     most specific therefore will be prioritised if available
     */

    const defaultConfig = mergeDeep(
      this.baseQueryConfigs?.default && this.baseQueryConfigs?.default,
      this.customQueryConfigs?.default && this.customQueryConfigs?.default
    );

    const specificQueryConfig = mergeDeep(
      this.baseQueryConfigs?.[query] && this.baseQueryConfigs?.[query],
      this.customQueryConfigs?.[query] && this.customQueryConfigs?.[query]
    );

    const mergedConfig = mergeDeep(defaultConfig, specificQueryConfig) as any;

    const isNonData = optionsIncludeNonDataValues(options);
    const isOnlyData = !isNonData;

    if (isOnlyData) return mergedConfig;
    if (isNonData) {
      return {
        ...mergedConfig,
        queryFn: defaultConfig.queryFn,
        // replace specificQueryFn with defaultQueryFn
      } as any;
    }
  }
  prismaModel: any = prisma[this.model] as any;

  // warning - baseQueryConfigs is object therefore resets 'this' value.
  // to access class 'this' eg this.model, must use ARROW FUNCTION =>

  whereWrapperQuery = (prismaProps) => {
    return (prisma[this.model] as any)[this.currentQuery]({
      where: {
        ...prismaProps,
      },
    });
  };
  baseQueryConfigs: IPartialQueryConfigs<TModel> = {
    default: {
      guard(requestData) {
        //future auth check
      },
      queryFn: (prismaProps) => {
        return (prisma[this.model] as any)[this.currentQuery](prismaProps);
      },
      // formatPrismaOptions(prismaProps) {
      //   return prismaProps;
      // },
      logDataBeforeQuery: false,
    },
    findMany: {
      queryFn: this.whereWrapperQuery,
    },
    findFirst: {
      queryFn: this.whereWrapperQuery,
    },
    findUnique: {
      queryFn: this.whereWrapperQuery,
    },
    delete: {
      queryFn: this.whereWrapperQuery,
    },
    update: {
      queryFn: ({ id, ...rest }) => {
        return this.prismaModel.update({ where: { id }, data: { ...rest } });
      },
    },
    create: {
      guard(requestData) {},
      queryFn: ({ resourceId, ...rest }: any) => {
        return this.prismaModel.create({
          data: {
            ...rest,
            ...(resourceId && { resource: { connect: { id: resourceId } } }),
          },
        });
      },
    },
  };
}

function optionsIncludeNonDataValues(options: Record<any, any>) {
  // non value options may conflict with processPrismaProps
  const nonDataValues = [
    'data',
    'distinct',
    'where',
    'cursor',
    'include',
    'orderBy',
    'select',
    'skip',
    'take',
  ];
  return Object.keys(options).some((option) => nonDataValues.includes(option));
}

/**
 * Wrapper for instanciating ApiController class:
 *
 * Server side controller for interacting with database.
 * 1. Controller sends requests to ApiController
 * 3. ApiController executes prisma query
 * 3. Prisma interacts with database and returns response
 * 4. ApiController returns Prisma response to Controller
 *
 * @param model prisma model which ApiController targets
 * @param customQueryConfigs config objects to customize default behaviour;
 * key = query name (or 'default'); value = config object.
 * Priority: customQueryConfigs > baseQueryConfigs
 * (default will be selected if no config for specific query)
 */

export function createApiHandler<TModel>(
  model: PrismaModelNames,
  customQueryConfigs?: IPartialQueryConfigs<TModel>
) {
  const apiController = new ApiController<TModel>(model, customQueryConfigs);
  return apiController.handler;
}

export interface IReqBody extends Record<any, any> {
  query: anyQuery;
  prismaProps: Record<string, any>;
}

type anyObj = Record<string, any>;

export interface IRequestData<TModel> extends anyObj {
  query: anyQuery;
  prismaProps: Partial<TModel>;
}

interface IQueryConfig<TModel> {
  queryFn: (prismaOptions: Partial<TModel> | any) => Promise<anyObj>;
  guard: (requestData: IRequestData<TModel>) => string | void | Promise<string>;
  logDataBeforeQuery: boolean;
}

type IPartialQueryConfigs<TModel> = Partial<
  Record<anyQuery | 'default', Partial<IQueryConfig<TModel>>>
>;
