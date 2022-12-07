import { apiValidate } from 'lib-server/apiValidate';
import { apiHandler } from 'lib-server/nc';
import prisma from 'lib-server/prisma';
import { ExampleModel } from 'prisma/zod';

const handler = apiHandler();

const schema = ExampleModel.pick({ id: true });

handler.get(apiValidate(schema), async (req, res) => {
  const data = await prisma.example.findUnique({
    where: {
      id: 1,
    },
  });

  res.json({ data });
});

handler.post(async (req, res) => {});

export default handler;
