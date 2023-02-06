import { Controller } from 'lib-client/controllers/Controller';
import {
  CompleteProject,
  CompleteTask,
  CompleteUser,
  ExampleModel,
  ProjectModel,
  TaskModel,
  UserModel,
} from 'prisma/zod';
import { z } from 'zod';

// export type IExample = z.infer<typeof ExampleModel>;
// export type ITask = z.infer<typeof TaskModel>;
// export type IUser = z.infer<typeof UserModel>;
// export type IProject = z.infer<typeof ProjectModel>;

// export const exampleController = new Controller<IExample>('example', {});
// export const taskController = new Controller<CompleteTask>('task');
// export const userController = new Controller<CompleteUser>('user');
// export const projectController = new Controller<CompleteProject>('project');

// also, return query key from useQuery in case we want to use it for changeUiKey
// also, change queryKey and changeUiKey to accept objects as well as strings
// also, create ControllerWrapper component which accepts same props as controller.use, calls controller.use and provides return to render prop
// provides default error and loading components
// rename to usePrismaQuery and PrismaApi
// maybe pq.use()
// PrismaQueryWrapper (possibly enable multiple queries uisng queryProps.map promise.all )
// dependencies: TS, react-query, prisma, axios, zod, zustand
// try to decouple from nc

// could add "specific key identifyier" prop which enables user to define more custom queries in config (eg every time I use "current project" I want same default prisma props in order for usequey to cache correctly but I dont want to override defaults for all "project.findUnique" queries)

// @davstack/prisma-query

// all configs specified in Controller.ts
// priority is:
// 5. anyModel.anyReadQuery / anyModel.anyWriteQuery
// 4. model.anyReadQuery / model.anyWriteQuery
// 3. anyModel.query
// 2. model.query
// 1. function args (and generics)

//must also specify type of data returned in configs ^^

/* 
queryConfigs = {
  anyModel: {
    anyWriteQuery: {


    },
    anyReadQuery: {

    },
    [query]: {
      ...options 
    }
  }

  [model]: {
    ^^ same as base
    type: CompleteModelType
  }

*/

// all configs specified in Controller.ts
// priority is:
// 1. function args
// 2. model.query
// 2. base.query
// 3. model.default
// 4. base.default

//must also specify type of data returned in configs ^^

/* 
queryConfigs = {
  base: (applies to all models) {
    default: {
      /?for all READ queries without specific handler use this config 
      useQueryOptions: {
        
        
        
      },
      /?for all WRITE queries without specific handler use this config 
      useMutationOptions: {

      }
    }
    [query]: {
      ...options 
    }
  }

  [model]: {
    ^^ same as base
  }

*/

// const [data, details] = controller.use({model: 'project',query:'findMany')
// const [mutateAsyc, details] = controller.use({model: 'project',query:'create')
// ^^ type inferered from query
