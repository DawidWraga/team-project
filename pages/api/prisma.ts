import { apiHandler } from 'lib-server/nc';
import prisma, { PrismaModelNames } from 'lib-server/prisma';
import { readOperations, writeOperations } from 'controllers/createController';
import { getAxiosErrorMessage } from 'lib-server/axios';
import { processPrismaProps } from 'lib-server/processPrismaProps';

const handler = apiHandler();

export interface IReqBody {
  operation: readOperations | writeOperations;
  model: PrismaModelNames;
  prismaProps: { [key: string]: any };
}

handler.post(async (req, res) => {
  let { operation, model, prismaProps }: IReqBody = req.body;

  try {
    const data = await (prisma[model] as any)[operation](
      processPrismaProps(prismaProps, operation)
    );
    res.send(data);
  } catch (e: any) {
    res.status(400).send(getAxiosErrorMessage(e));
  }
});

export default handler;
