import * as z from 'zod';
import {
  CompleteUser,
  CompleteTaskStatus,
  CompleteProject,
  CompleteSubTask,
} from './index';

export const TaskModel = z.object({
  id: z.number().int(),
  title: z.string().trim(),
  createdDate: z.date(),
  dueDate: z.date(),
  description: z.string(),
  updatedAt: z.date(),
  statusId: z.number().int(),
  projectId: z.number().int(),
  manhours: z.number(),
});

export interface CompleteTask extends z.infer<typeof TaskModel> {
  assignees: CompleteUser[];
  status: CompleteTaskStatus;
  project: CompleteProject;
  subTasks: CompleteSubTask[];
}
