import * as z from 'zod';
import { CompleteTag, CompleteUser } from './index';

export const DocumentModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string().min(3).trim(),
  content: z.unknown(),
});

export interface CompleteDocument extends z.infer<typeof DocumentModel> {
  tags: CompleteTag[];
  authors: CompleteUser[];
}
