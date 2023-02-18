import * as z from "zod"
import * as imports from "./helpers"
import { CompleteTag, RelatedTagModel, CompleteUser, RelatedUserModel } from "./index"

export const DocumentModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string().min(3).trim(),
  content: z.unknown(),
})

export interface CompleteDocument extends z.infer<typeof DocumentModel> {
  tags: CompleteTag[]
  authors: CompleteUser[]
}

/**
 * RelatedDocumentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDocumentModel: z.ZodSchema<CompleteDocument> = z.lazy(() => DocumentModel.extend({
  tags: RelatedTagModel.array(),
  authors: RelatedUserModel.array(),
}))
