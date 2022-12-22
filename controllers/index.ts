import { createController } from 'controllers/createController';
import { ExampleModel, TaskModel } from 'prisma/zod';
import { z } from 'zod';

type IExample = z.infer<typeof ExampleModel>;

export const Example = createController<IExample>({
  model: 'example',
});

type ITask = z.infer<typeof TaskModel>;
export const taskController = createController<ITask>({
  model: 'task',
});
