import * as z from "zod"
import * as imports from "./helpers"
import { CompleteComment, RelatedCommentModel, CompleteUser, RelatedUserModel } from "./index"

export const PostModel = z.object({
  id: z.number().int(),
  date_created: z.date(),
  date_updated: z.date().nullish(),
  title: z.string().min(3),
  content: z.string(),
  solved: z.boolean(),
  author_id: z.number().int(),
})

export interface CompletePost extends z.infer<typeof PostModel> {
  replies: CompleteComment[]
  author: CompleteUser
}

/**
 * RelatedPostModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPostModel: z.ZodSchema<CompletePost> = z.lazy(() => PostModel.extend({
  replies: RelatedCommentModel.array(),
  author: RelatedUserModel,
}))
