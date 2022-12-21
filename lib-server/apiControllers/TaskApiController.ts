import { BaseApiController } from 'lib-server/apiControllers/BaseApiController';

export class TaskApiController extends BaseApiController {}

export const taskApiController = new TaskApiController('task');
