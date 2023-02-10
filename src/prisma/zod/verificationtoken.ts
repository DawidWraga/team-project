import * as z from "zod"
import * as imports from "./helpers"

export const VerificationTokenModel = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
})
