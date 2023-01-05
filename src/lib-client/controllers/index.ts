import { createController } from 'lib-client/controllers/createController';
import { ExampleModel, TaskModel, UserModel } from 'prisma/zod';
import { z } from 'zod';

type IExample = z.infer<typeof ExampleModel>;

export const exampleController = createController<IExample>({
  model: 'example',
  queries: ['findMany', 'findUnique', 'update', 'delete', 'create'],
});

type ITask = z.infer<typeof TaskModel>;
export const taskController = createController<ITask>({
  model: 'task',
  queries: ['findMany', 'findUnique', 'update', 'delete', 'create'],
});

type IUser = z.infer<typeof UserModel>;
export const userController = createController<IUser>({
  model: 'user',
  queries: ['findMany', 'findUnique', 'update', 'delete', 'create'],
});

// userController.findMany.use({})

// userController.use('findMany',)
