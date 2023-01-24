import * as z from "zod"
import * as imports from "./helpers"
import { CompleteUser, RelatedUserModel, CompletePost, RelatedPostModel } from "./index"

export const CommentModel = z.object({
  id: z.number().int(),
  content: z.string(),
  createdAt: z.date(),
  authorId: z.number().int(),
  postId: z.number().int(),
})

export interface CompleteComment extends z.infer<typeof CommentModel> {
  author: CompleteUser
  post: CompletePost
}

/**
 * RelatedCommentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCommentModel: z.ZodSchema<CompleteComment> = z.lazy(() => CommentModel.extend({
  author: RelatedUserModel,
  post: RelatedPostModel,
}))
