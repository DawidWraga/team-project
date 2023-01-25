import * as z from "zod"
import * as imports from "./helpers"
import { CompleteTask, RelatedTaskModel } from "./index"

export const SubTaskModel = z.object({
  id: z.number().int(),
  description: z.string(),
  completed: z.boolean(),
  taskId: z.number().int(),
})

export interface CompleteSubTask extends z.infer<typeof SubTaskModel> {
  task: CompleteTask
}

/**
 * RelatedSubTaskModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSubTaskModel: z.ZodSchema<CompleteSubTask> = z.lazy(() => SubTaskModel.extend({
  task: RelatedTaskModel,
}))
