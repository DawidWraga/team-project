import * as z from 'zod';
import { CompleteUser } from './index';

export const AccountModel = z.object({
  id: z.string(),
  userId: z.number().int(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullish(),
  access_token: z.string().nullish(),
  expires_at: z.number().int().nullish(),
  token_type: z.string().nullish(),
  scope: z.string().nullish(),
  id_token: z.string().nullish(),
  session_state: z.string().nullish(),
});

export interface CompleteAccount extends z.infer<typeof AccountModel> {
  user: CompleteUser;
}
