import * as z from 'zod';
import {
  CompleteUserRole,
  CompletePost,
  CompleteComment,
  CompleteTask,
  CompleteProject,
  CompleteAccount,
  CompleteSession,
  CompleteDocument,
} from './index';

export const UserModel = z.object({
  id: z.number().int(),
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .max(25)
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/),
  userIcon: z.string(),
  roleId: z.number().int(),
});

export interface CompleteUser extends z.infer<typeof UserModel> {
  role: CompleteUserRole;
  posts: CompletePost[];
  comments: CompleteComment[];
  tasksAssigned: CompleteTask[];
  projectsAssigned: CompleteProject[];
  projectsManaged: CompleteProject[];
  Account: CompleteAccount[];
  Session: CompleteSession[];
  Document: CompleteDocument[];
}
