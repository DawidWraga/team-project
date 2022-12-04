import * as z from "zod"
import * as imports from "./helpers"
import { CompleteUser, RelatedUserModel, CompleteTask, RelatedTaskModel } from "./index"

export const ProjectModel = z.object({
  id: z.number().int(),
  title: z.string(),
  created_date: z.date(),
  due_date: z.date(),
})

export interface CompleteProject extends z.infer<typeof ProjectModel> {
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
  assignees: RelatedUserModel.array(),
  managers: RelatedUserModel.array(),
  tasks: RelatedTaskModel.array(),
}))
