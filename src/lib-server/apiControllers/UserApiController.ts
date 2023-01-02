import { BaseApiController } from 'lib-server/apiControllers/BaseApiController';

export class UserApiController extends BaseApiController {}

export const userApiController = new UserApiController('user');
