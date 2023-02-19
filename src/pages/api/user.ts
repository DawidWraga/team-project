import { hash } from 'bcrypt';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';
import moment from 'moment';
import { CompleteUser } from 'prisma/zod';

export default createApiHandler<CompleteUser>('user', {
  create: {
    async guard({ query, prismaProps }) {
      const invitations = await prisma.invitation.findMany({
        where: { email: prismaProps.email },
      });

      if (invitations?.length === 0) {
        return 'You must have an invitation to register.';
      }

      const mostRecentInvitation = invitations.sort(
        (a: any, b: any) => b.createdAt - a.createdAt
      )[0];

      const invitationLifespanHours = 24;
      const expiresAt = moment(mostRecentInvitation.createdAt).add(
        invitationLifespanHours,
        'hours'
      );

      const isExpired = moment().isAfter(expiresAt);

      if (isExpired) {
        return 'Your invitation has expired.';
      }
    },
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
