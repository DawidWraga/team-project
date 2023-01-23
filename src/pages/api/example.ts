import { BaseApiController } from 'lib-server/apiControllers/BaseApiController';

export class ExampleApiController extends BaseApiController {
constructor() {
super('example')

}
}

export const exampleApiController = new ExampleApiController();

export default exampleApiController.handler;


console.log('hello world')




// aim: model = example & operation = 'findMany' then customhandler()


// completely specific => inside Specific model controller