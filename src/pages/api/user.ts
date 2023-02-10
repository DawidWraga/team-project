import { hash } from 'argon2';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';
import { CompleteUser } from 'prisma/zod';
import { setTimeout } from 'timers/promises';

export default createApiHandler<CompleteUser>('user', {
  create: {
    async queryFn(prismaOptions) {
      const hashedPassword = await hash(prismaOptions.password);
      return prisma.user.create({
        data: {
          ...prismaOptions,
          password: hashedPassword,
        },
      });
    },
  },
});
