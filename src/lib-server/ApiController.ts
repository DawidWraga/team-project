import type { anyQuery } from 'lib-client/controllers/types/Controller';
import { getAxiosErrorMessage } from 'lib-server/axios';
import { apiHandler } from 'lib-server/nc';
import { prisma } from 'lib-server/prisma';
import { PrismaModelNames } from 'lib-server/prisma';
import { mergeDeep } from 'utils/deepMerge';

/**
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

export class ApiController<TModel> {
  constructor(
    public model: PrismaModelNames,
    public customQueryConfigs?: IPartialQueryConfigs<TModel>
  ) {}
  public handler = apiHandler().post(async (req, res) => {
    try {
      const { query, prismaQueryOptions: unprocessedOptions }: IRequestData<TModel> =
        req.body;

      // get handlers for specific query
      const config = this.getConfig(query);
      const { queryFn, guard, formatPrismaOptions, logDataBeforeQuery } = config;

      // guard clause for validation
      const errorMessage = guard(req.body);
      if (typeof errorMessage === 'string') {
        throw new Error('Request failed.', { cause: errorMessage });
      }

      // format prisma options
      const prismaQueryOptions = formatPrismaOptions(unprocessedOptions);

      const processedReqData = {
        ...req.body,
        prismaQueryOptions,
      };
      // log for debugging
      if (logDataBeforeQuery) {
        console.log({ model: this.model, ...processedReqData });
      }

      // run prisma query
      const data = await queryFn(processedReqData);

      res.send(data);
    } catch (e: any) {
      res.status(400).send(getAxiosErrorMessage(e));
    }
  });

  getConfig(query: anyQuery) {
    /**
     * merges configs to select most specific and fallback to highest possible specificity
     */

    return mergeDeep(
      // least specific therefore will be overwritten if possible
      this.baseQueryConfigs?.default && this.baseQueryConfigs?.default,
      this.customQueryConfigs?.default && this.customQueryConfigs?.default,
      this.baseQueryConfigs?.[query] && this.baseQueryConfigs?.[query],
      this.customQueryConfigs?.[query] && this.customQueryConfigs?.[query]
      // most specific therefore will be prioritised if available
    ) as IQueryConfig<TModel>;
  }
  // warning - baseQueryConfigs is object therefore resets 'this' value.
  // to access class 'this' eg this.model, must use ARROW FUNCTION =>
  baseQueryConfigs: IPartialQueryConfigs<TModel> = {
    default: {
      guard(requestData) {
        //future auth check
      },
      queryFn: (requestData) => {
        const { query, prismaQueryOptions } = requestData;

        return (prisma[this.model] as any)[query](prismaQueryOptions);
      },
      formatPrismaOptions(prismaQueryOptions) {
        return prismaQueryOptions;
      },
      logDataBeforeQuery: false,
    },
    findMany: {
      formatPrismaOptions: whereWrapper,
    },
    findFirst: {
      formatPrismaOptions: whereWrapper,
    },
    findUnique: {
      formatPrismaOptions: whereWrapper,
    },
    delete: {
      formatPrismaOptions: whereWrapper,
    },
    update: {
      formatPrismaOptions(prismaQueryOptions) {
        const { id, ...rest } = prismaQueryOptions || {};
        return { where: { id }, data: { ...rest } };
      },
    },
    create: {
      guard(requestData) {},
      formatPrismaOptions(prismaQueryOptions) {
        if (!prismaQueryOptions.resourceId) return { data: prismaQueryOptions };
        const { resourceId, ...rest } = prismaQueryOptions;

        return {
          data: {
            ...rest,
            resource: { connect: { id: resourceId } },
          },
        };
      },
    },
  };
}

const whereWrapper = <T>({
  where = {},
  ...item
}: {
  where?: anyObj;
  item?: T;
} = {}) => ({
  where: { ...where, ...item },
});

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
  prismaQueryOptions: Record<string, any>;
}

type anyObj = Record<string, any>;

export interface IRequestData<TModel> extends anyObj {
  query: anyQuery;
  prismaQueryOptions: Partial<TModel>;
}

interface IQueryConfig<TModel> {
  queryFn: (requestData: IRequestData<TModel>) => Promise<anyObj>;
  guard: (requestData: IRequestData<TModel>) => string | void;
  formatPrismaOptions: (prismaQueryOptions: anyObj) => anyObj;
  logDataBeforeQuery: boolean;
}

type IPartialQueryConfigs<TModel> = Partial<
  Record<anyQuery | 'default', Partial<IQueryConfig<TModel>>>
>;
