import * as z from 'zod';
import { CompleteTaskStatus, CompleteUser, CompleteTask } from './index';

export const ProjectModel = z.object({
  id: z.number().int(),
  title: z.string(),
  createdDate: z.date(),
  dueDate: z.date(),
});

export interface CompleteProject extends z.infer<typeof ProjectModel> {
  statuses: CompleteTaskStatus[];
  assignees: CompleteUser[];
  managers: CompleteUser[];
  tasks: CompleteTask[];
}
