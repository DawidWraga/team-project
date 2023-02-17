import * as z from "zod"
import * as imports from "./helpers"

export const InvitationsModel = z.object({
  id: z.number().int(),
  email: z.string().email().trim(),
  createdAt: z.date(),
})
