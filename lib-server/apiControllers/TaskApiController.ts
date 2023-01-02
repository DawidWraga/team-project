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
