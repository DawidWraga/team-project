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

export type IExample = z.infer<typeof ExampleModel>;
export type ITask = z.infer<typeof TaskModel>;
export type IUser = z.infer<typeof UserModel>;
export type IProject = z.infer<typeof ProjectModel>;

export const exampleController = new Controller<IExample>('example', {});
export const taskController = new Controller<CompleteTask>('task');
export const userController = new Controller<CompleteUser>('user');
export const projectController = new Controller<CompleteProject>('project');
