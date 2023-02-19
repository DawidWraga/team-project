import * as z from 'zod';
import { CompleteUser } from './index';

export const SessionModel = z.object({
  id: z.string(),
  sessionToken: z.string(),
  userId: z.number().int(),
  expires: z.date(),
});

export interface CompleteSession extends z.infer<typeof SessionModel> {
  user: CompleteUser;
}
