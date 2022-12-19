import { apiHandler } from 'lib-server/nc';
import prisma, { PrismaModelNames } from 'lib-server/prisma';
import { readOperations, writeOperations } from 'controllers/createController';
import { getAxiosErrorMessage } from 'lib-server/axios';

const handler = apiHandler();

interface IReqBody {
  operation: readOperations | writeOperations;
  model: PrismaModelNames;
  prismaProps: { [key: string]: any };
}

handler.post(async (req, res) => {
  // console.log('api/prisma fired', req.body);

  let { operation, model, prismaProps }: IReqBody = req.body;

  //=============== apply defaults for convenience
  if (operation === 'create' && !prismaProps.data) prismaProps = { data: prismaProps };
  if (
    operation.includes('find') ||
    (operation === 'delete' && prismaProps && !prismaProps.where)
  )
    prismaProps = { where: prismaProps };
  if (
    operation.includes('update') &&
    prismaProps.id &&
    !prismaProps.where &&
    !prismaProps.data
  ) {
    const { id, ...rest } = prismaProps;
    prismaProps = { where: { id }, data: { ...rest } };
  }

  try {
    const data = await (prisma[model] as any)[operation](prismaProps);
    res.send(data);
  } catch (e: any) {
    res.status(400).send(getAxiosErrorMessage(e));
  }
});

export default handler;
