import * as z from "zod"
import * as imports from "./helpers"
import { CompleteUserRole, RelatedUserRoleModel, CompletePost, RelatedPostModel, CompleteComment, RelatedCommentModel, CompleteTask, RelatedTaskModel, CompleteProject, RelatedProjectModel } from "./index"

export const UserModel = z.object({
  id: z.number().int(),
  full_name: z.string().min(3),
  email: z.string().email(),
  password: z.string().max(25).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/),
  user_icon: z.string(),
  role_id: z.number().int(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  role: CompleteUserRole
  posts: CompletePost[]
  comments: CompleteComment[]
  tasks_assigned: CompleteTask[]
  projects_assigned: CompleteProject[]
  projects_managed: CompleteProject[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  role: RelatedUserRoleModel,
  posts: RelatedPostModel.array(),
  comments: RelatedCommentModel.array(),
  tasks_assigned: RelatedTaskModel.array(),
  projects_assigned: RelatedProjectModel.array(),
  projects_managed: RelatedProjectModel.array(),
}))
