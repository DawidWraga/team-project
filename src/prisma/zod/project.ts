import * as z from "zod"
import * as imports from "./helpers"
import { CompleteTaskStatus, RelatedTaskStatusModel, CompleteUser, RelatedUserModel, CompleteTask, RelatedTaskModel } from "./index"

export const ProjectModel = z.object({
  id: z.number().int(),
  title: z.string(),
  createdDate: z.date(),
  dueDate: z.date(),
})

export interface CompleteProject extends z.infer<typeof ProjectModel> {
  statuses: CompleteTaskStatus[]
  assignees: CompleteUser[]
  managers: CompleteUser[]
  tasks: CompleteTask[]
}

/**
 * RelatedProjectModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProjectModel: z.ZodSchema<CompleteProject> = z.lazy(() => ProjectModel.extend({
  statuses: RelatedTaskStatusModel.array(),
  assignees: RelatedUserModel.array(),
  managers: RelatedUserModel.array(),
  tasks: RelatedTaskModel.array(),
}))
