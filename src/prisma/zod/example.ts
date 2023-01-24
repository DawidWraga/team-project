import * as z from "zod"
import * as imports from "./helpers"

export const ExampleModel = z.object({
  id: z.number().int(),
  dateCreated: z.date(),
  text: z.string().min(3),
})
