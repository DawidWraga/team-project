import { ITask } from 'lib-client/controllers';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';

export default createApiHandler<ITask>('task', {
  findMany: {
    formatPrismaOptions(prismaQueryOptions) {
      return prismaQueryOptions;
    },
  },
  create: {
    formatPrismaOptions(prismaQueryOptions) {
      return prismaQueryOptions;
    },
    async queryFn({ prismaQueryOptions }: any) {
      console.log(prismaQueryOptions);
      const { projectId, ...options } = prismaQueryOptions;
      return prisma.task.create({
        data: {
          ...options,
          // title: 'hi',
          // due_date: new Date(),
          // description: 'hello',
          status: {
            connect: {
              id: 1,
            },
          },
          asignees: {
            connect: {
              id: 1,
            },
          },
          project: {
            connect: {
              id: projectId,
            },
          },
        },
      });
    },
  },
});
