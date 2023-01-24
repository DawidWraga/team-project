import * as z from "zod"
import * as imports from "./helpers"
import { CompleteTask, RelatedTaskModel, CompleteProject, RelatedProjectModel } from "./index"

export const TaskStatusModel = z.object({
  id: z.number().int(),
  label: z.string().trim(),
})

export interface CompleteTaskStatus extends z.infer<typeof TaskStatusModel> {
  tasks: CompleteTask[]
  Project: CompleteProject[]
}

/**
 * RelatedTaskStatusModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTaskStatusModel: z.ZodSchema<CompleteTaskStatus> = z.lazy(() => TaskStatusModel.extend({
  tasks: RelatedTaskModel.array(),
  Project: RelatedProjectModel.array(),
}))
