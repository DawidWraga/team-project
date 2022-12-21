import { BaseApiController } from 'lib-server/apiControllers/BaseApiController';

export class ExampleApiController extends BaseApiController {}

export const exampleApiController = new ExampleApiController('example');
