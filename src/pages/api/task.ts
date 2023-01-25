import { ITask } from 'lib-client/controllers';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';
import { z } from 'zod';

export default createApiHandler<ITask>('task', {
  findMany: {},
  default: {},
  create: {
    queryFn({ projectId, ...options }: any) {
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
