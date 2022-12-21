import { createController } from 'controllers/createController';
import { ExampleModel } from 'prisma/zod';
import { z } from 'zod';

type IExample = z.infer<typeof ExampleModel>;

export const Example = createController<IExample>({
  model: 'example',
});
