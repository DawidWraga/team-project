import { createController } from 'controllers/createController';
import { IOperations } from 'controllers/createController';
import { Prisma } from '@prisma/client';
import { ExampleModel } from 'prisma/zod';
import { z } from 'zod';

type IExample = z.infer<typeof ExampleModel>;

export const Example = createController<IExample>({
  model: 'example',
});
