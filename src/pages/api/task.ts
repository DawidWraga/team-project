import { ITask } from 'lib-client/controllers';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';
import { z } from 'zod';

export default createApiHandler<ITask>('task', {
  findMany: {},
  default: {},
  create: {
    queryFn({ projectId, subTask, assignees, ...options }: any) {
      console.log(assignees);
      return prisma.task.create({
        data: {
          ...options,
          status: {
            connect: {
              id: 1,
            },
          },
          assignees: {
            connect: assignees,
          },
          project: {
            connect: {
              id: projectId,
            },
          },
          subTasks: {
            create: subTask,
          },
        },
      });
    },
  },
  update: {
    queryFn({ id, statusId, ...data }) {
      return prisma.task.update({
        where: {
          id,
        },
        data: {
          ...data,
          status: {
            connect: {
              id: statusId,
            },
          },
        },
      });
    },
  },
});
