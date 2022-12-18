import { apiValidate } from 'lib-server/apiValidate';
import { apiHandler } from 'lib-server/nc';
import prisma from 'lib-server/prisma';
import { ExampleModel } from 'prisma/zod';

const handler = apiHandler();

handler.post(async (req, res) => {
  console.log('api/prisma fired');

  const { operation } = req.body;

  if (operation === 'findMany') {
    const data = await prisma.example.findMany();
    res.send(data);
  }

  if (operation === 'create') {
    // console.log(req.body.data.prismaProps);
    console.log(req.body);
    const { data } = req.body.prismaProps;
    console.log(data);
    const prismaRes = await prisma.example.create({
      data,
    });
    res.send(prismaRes);
  }

  // const data = await prisma.example.findUnique({
  //   where: {
  //     id: 1,
  //   },
  // });

  // res.json({ data });
});

handler.post(async (req, res) => {});

export default handler;
