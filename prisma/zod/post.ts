import * as z from "zod"
import * as imports from "./helpers"

export const PostModel = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  title: z.string().min(3),
})
