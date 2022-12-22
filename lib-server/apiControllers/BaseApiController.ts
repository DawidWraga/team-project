import { readOperations, writeOperations } from 'controllers/createController';
import { getAxiosErrorMessage } from 'lib-server/axios';
import { apiHandler } from 'lib-server/nc';
import prisma, { PrismaModelNames } from 'lib-server/prisma';

export interface IReqBody {
  operation: readOperations | writeOperations;
  prismaProps: { [key: string]: any };
}
interface ICheck {
  operationType: 'create' | 'find' | 'update' | 'delete';
  additionalGuards?: any[]; //converted into boolean, if true return prismaProps (unprocessed)
  processed: Record<string, any>;
}

export class BaseApiController {
  constructor(public model: PrismaModelNames, public handler = apiHandler()) {
    this.handler.post(async (req, res) => {
      const { operation, prismaProps }: IReqBody = req.body;

      try {
        const data = await (prisma[this.model] as any)[operation](
          this.processPrismaProps(prismaProps, operation)
        );
        res.send(data);
      } catch (e: any) {
        res.status(400).send(getAxiosErrorMessage(e));
      }
    });
  }
  processPrismaProps(prismaProps: any | undefined, operation: string) {
    if (!prismaProps) return {};
    const checks: ICheck[] = [
      {
        operationType: 'create',
        processed: { data: prismaProps },
      },
      {
        operationType: 'find',
        processed: { where: prismaProps },
      },
      {
        operationType: 'delete',
        processed: { where: prismaProps },
      },
      {
        operationType: 'update',
        processed: (() => {
          const { id, ...rest } = prismaProps || {};
          return { where: { id }, data: { ...rest } };
        })(),
      },
    ];

    for (const { operationType, additionalGuards, processed } of checks) {
      if (!operation.includes(operationType)) continue;

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