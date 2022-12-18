import { apiValidate } from 'lib-server/apiValidate';
import { apiHandler } from 'lib-server/nc';
import prisma from 'lib-server/prisma';
import { ExampleModel } from 'prisma/zod';

const handler = apiHandler();

handler.post(async (req, res) => {
  // console.log('api/prisma fired', req.body);

  let { operation, model, prismaProps } = req.body;

  //apply default data format for convenience
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
  console.log({ prismaProps });
  try {
    const data = await prisma[model][operation](prismaProps);
    res.send(data);
  } catch (e) {
    res.status(400).send(e);
  }
});

export default handler;
