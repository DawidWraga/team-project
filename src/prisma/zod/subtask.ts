import * as z from 'zod';
import { CompleteTask } from './index';

export const SubTaskModel = z.object({
  id: z.number().int(),
  description: z.string(),
  completed: z.boolean(),
  taskId: z.number().int(),
});

export interface CompleteSubTask extends z.infer<typeof SubTaskModel> {
  task: CompleteTask;
}
