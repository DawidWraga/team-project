import * as z from "zod"
import * as imports from "./helpers"
import { CompleteUser, RelatedUserModel, CompleteTaskStatus, RelatedTaskStatusModel, CompleteProject, RelatedProjectModel } from "./index"

export const TaskModel = z.object({
  id: z.number().int(),
  title: z.string().trim(),
  createdDate: z.date(),
  dueDate: z.date(),
  description: z.string(),
  statusId: z.number().int(),
  projectId: z.number().int(),
})

export interface CompleteTask extends z.infer<typeof TaskModel> {
  asignees: CompleteUser[]
  status: CompleteTaskStatus
  project: CompleteProject
}

/**
 * RelatedTaskModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTaskModel: z.ZodSchema<CompleteTask> = z.lazy(() => TaskModel.extend({
  asignees: RelatedUserModel.array(),
  status: RelatedTaskStatusModel,
  project: RelatedProjectModel,
}))
