import * as z from 'zod';
import * as imports from './helpers';
import { CompleteUser } from './index';

export const UserRoleModel = z.object({
  id: z.number().int(),
  label: z.string().trim(),
});

export interface CompleteUserRole extends z.infer<typeof UserRoleModel> {
  users: CompleteUser[];
}
