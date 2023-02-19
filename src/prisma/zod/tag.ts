import * as z from 'zod';
import { CompleteDocument } from './index';

export const TagModel = z.object({
  id: z.number().int(),
  label: z.string().trim(),
  color: z.string().trim(),
});

export interface CompleteTag extends z.infer<typeof TagModel> {
  documents: CompleteDocument[];
}
