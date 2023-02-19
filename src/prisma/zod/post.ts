import * as z from 'zod';
import { CompleteComment, CompleteUser } from './index';

export const PostModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  title: z.string().min(3),
  content: z.string(),
  solved: z.boolean(),
  authorId: z.number().int(),
});

export interface CompletePost extends z.infer<typeof PostModel> {
  replies: CompleteComment[];
  author: CompleteUser;
}
