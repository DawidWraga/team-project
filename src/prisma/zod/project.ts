import * as z from "zod"
import * as imports from "./helpers"
import { CompleteTaskStatus, RelatedTaskStatusModel, CompleteUser, RelatedUserModel, CompleteTask, RelatedTaskModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const ProjectModel = z.object({
  id: z.number().int(),
  title: z.string(),
  createdDate: z.date(),
  dueDate: z.date(),
  statusToOrderedTaskIds: jsonSchema,
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
