import { anyQuery } from 'lib-client/controllers/createController';
import { getAxiosErrorMessage } from 'lib-server/axios';
import { apiHandler } from 'lib-server/nc';
import { prisma, PrismaModelNames } from 'lib-server/prisma';
import { NextApiRequest } from 'next';
import { setTimeout } from 'timers/promises';

export interface IReqBody {
  query: anyQuery;
  prismaProps: { [key: string]: any };
}
interface ICheck {
  queryType: 'create' | 'find' | 'update' | 'delete';
  additionalGuards?: any[]; //converted into boolean, if true return prismaProps (unprocessed)
  processed: Record<string, any>;
}

export class BaseApiController {


  constructor(public model: PrismaModelNames, public handler = apiHandler()) {
    handler.post(async (req, res) => {
      const { query, prismaProps }: IReqBody = req.body;

      try {
        // specific handler
        // if (specificHandler) specificHandler(req);

        // default handler
        await setTimeout(1000);
        const data = await (prisma[this.model] as any)[query](
          this.processPrismaProps(prismaProps, query)
        );
        res.send(data);
      } catch (e: any) {
        res.status(400).send(getAxiosErrorMessage(e));
      }
    });
  }

  // handler() { // specificHandler?: (req: NextApiRequest) => any
  //   const handler = apiHandler();

  //   handler.post(async (req, res) => {
  //     const { query, prismaProps }: IReqBody = req.body;

  //     try {
  //       // specific handler
  //       if (specificHandler) specificHandler(req);

  //       // default handler
  //       const data = await (prisma[this.model] as any)[query](
  //         this.processPrismaProps(prismaProps, query)
  //       );
  //       res.send(data);
  //     } catch (e: any) {
  //       res.status(400).send(getAxiosErrorMessage(e));
  //     }
  //   });

  //   return handler;
  // }

  processPrismaProps(prismaProps: any | undefined, query: string) {
    if (!prismaProps) return {};
    const checks: ICheck[] = [
      {
        queryType: 'create',
        processed: { data: prismaProps },
      },
      {
        queryType: 'find',
        processed: { where: prismaProps },
      },
      {
        queryType: 'delete',
        processed: { where: prismaProps },
      },
      {
        queryType: 'update',
        processed: (() => {
          const { id, ...rest } = prismaProps || {};
          return { where: { id }, data: { ...rest } };
        })(),
      },
    ];

    for (const { queryType, additionalGuards, processed } of checks) {
      if (!query.includes(queryType)) continue;

      // if props already nested then prevent processing to allow flexiblity
      for (const key of Object.keys(processed)) {
        if (prismaProps[key]) return prismaProps;
      }

      // if any additionalGuards are true then return unproccessed
      if (additionalGuards && additionalGuards.some((guard) => !!guard))
        return prismaProps;

      return processed;
    }

    return prismaProps;
  }
}
