import * as z from "zod"
import * as imports from "./helpers"
import { CompleteDocument, RelatedDocumentModel } from "./index"

export const TagModel = z.object({
  id: z.number().int(),
  label: z.string().trim(),
  color: z.string().trim(),
})

export interface CompleteTag extends z.infer<typeof TagModel> {
  documents: CompleteDocument[]
}

/**
 * RelatedTagModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTagModel: z.ZodSchema<CompleteTag> = z.lazy(() => TagModel.extend({
  documents: RelatedDocumentModel.array(),
}))
