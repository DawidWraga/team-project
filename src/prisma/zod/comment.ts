import * as z from 'zod';
import { CompleteUser, CompletePost } from './index';

export const CommentModel = z.object({
  id: z.number().int(),
  content: z.string(),
  createdAt: z.date(),
  authorId: z.number().int(),
  postId: z.number().int(),
});

export interface CompleteComment extends z.infer<typeof CommentModel> {
  author: CompleteUser;
  post: CompletePost;
}
