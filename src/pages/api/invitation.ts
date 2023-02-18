import { Invitation } from '@prisma/client';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';

export default createApiHandler<Invitation>('invitation', {
  createMany: {
    queryFn: async (email) => {
      console.log(email);
      return {} as any;
      //   return await prisma.invitation.createMany({
      //     data: email,
      //     skipDuplicates: true,
      //   });
    },
  },
});
