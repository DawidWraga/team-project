import * as z from "zod"
import * as imports from "./helpers"
import { CompleteUser, RelatedUserModel } from "./index"

export const UserRoleModel = z.object({
  id: z.number().int(),
  label: z.string().trim(),
})

export interface CompleteUserRole extends z.infer<typeof UserRoleModel> {
  users: CompleteUser[]
}

/**
 * RelatedUserRoleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserRoleModel: z.ZodSchema<CompleteUserRole> = z.lazy(() => UserRoleModel.extend({
  users: RelatedUserModel.array(),
}))
