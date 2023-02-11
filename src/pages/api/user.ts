import { hash } from 'bcrypt';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';
import { CompleteUser } from 'prisma/zod';

export default createApiHandler<CompleteUser>('user', {
  create: {
    async queryFn({ password, ...prismaOptions }) {
      const hashedPassword = await hash(password, 10);
      return prisma.user.create({
        data: {
          ...prismaOptions,
          password: hashedPassword,
        },
      });
    },
  },
});
