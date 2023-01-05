import { BaseApiController } from 'lib-server/apiControllers/BaseApiController';

function checkIsAuth() {
  console.log('yes');
}

export class TaskApiController extends BaseApiController {
  constructor() {
    super('task');
  }
}

export const taskApiController = new TaskApiController();


export default taskApiController.handler;

// import { apiHandler } from 'lib-server/nc';

// const handler = apiHandler();

// handler.get(async (req, res) => {
//   // res.json({ bod: req.body });
//   const prismaRes = await prisma.example.findMany();
//   res.json(prismaRes);
// });
// export default handler;
