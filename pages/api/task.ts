// import { taskApiController } from 'lib-server/apiControllers/TaskApiController';

// const { handler } = taskApiController;

// export default handler;

import { apiHandler } from 'lib-server/nc';
import prisma from 'lib-server/prisma';

const handler = apiHandler();

handler.get(async (req, res) => {
  // res.json({ bod: req.body });
  const prismaRes = await prisma.example.findMany();
  res.json(prismaRes);
});
export default handler;
