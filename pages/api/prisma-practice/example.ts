import { apiValidate } from 'lib-server/apiValidate';
import { apiHandler } from 'lib-server/nc';
import prisma from 'lib-server/prisma';
import { ExampleModel } from 'prisma/zod';

const handler = apiHandler();

handler.get(apiValidate(ExampleModel.pick({ id: true })), async (req, res) => {
  const { where } = req.body;

  const example = await prisma.example.findUnique({
    where,
  });

  return res.json({ example });
});

handler.post(apiValidate(ExampleModel.pick({ text: true })), async (req, res) => {
  const data = req.body;

  const example = await prisma.example.create({ data });


  res.json({ example });
});

export default handler;
