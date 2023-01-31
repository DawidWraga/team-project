import { Prisma } from '@prisma/client';
import { ITask } from 'lib-client/controllers';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';
import { z } from 'zod';

export default createApiHandler<ITask>('task', {
  findMany: {},
  default: {},
  create: {
    queryFn({ projectId, subTask, assignees, statusId, ...options }: any) {
      console.log(assignees);
      return prisma.task.create({
        data: {
          ...options,
          status: {
            connect: {
              id: statusId,
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
    queryFn({
      id,
      status,
      statusId,
      assignees,
      projectId,
      statusToOrderedTaskIds,
      ...data
    }) {
      return prisma.task.update({
        where: {
          id,
        },
        data: {
          ...data,
          ...(statusToOrderedTaskIds && {
            statusToOrderedTaskIds: statusToOrderedTaskIds as Prisma.JsonObject,
          }),
          status: {
            connect: {
              id: status?.id || statusId,
            },
          },
          assignees: {
            connect: assignees?.map((user) => ({ id: user.id })) || [],
          },
          // subTasks: {
          //   create: subTask,
          // },
        },
      });
    },
  },
});
