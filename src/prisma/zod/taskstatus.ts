import * as z from 'zod';
import {
  CompleteTask, CompleteProject
} from './index';

export const TaskStatusModel = z.object({
  id: z.number().int(),
  label: z.string().trim(),
  projectId: z.number().int(),
});

export interface CompleteTaskStatus extends z.infer<typeof TaskStatusModel> {
  tasks: CompleteTask[];
  project: CompleteProject;
}
