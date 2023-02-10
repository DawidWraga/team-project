import { Prisma } from '@prisma/client';
import { anyQuery } from 'lib-client/controllers/types/Controller';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';
import { CompleteTask } from 'prisma/zod';
import { z } from 'zod';

export default createApiHandler<CompleteTask>('task', {
  create: {
    queryFn({ projectId, subTask, assignees, statusId, ...options }) {
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
      // might be able to just use same logic for both if mapping through empty array prouces same outcome
      let assingeeVal: any = null;
      if (assignees && assignees.length === 0) {
        assingeeVal = { set: [] };
      } else if (assignees && assignees.length > 0) {
        assingeeVal = { set: [], connect: assignees?.map((user) => ({ id: user.id })) };
      }

      return prisma.task.update({
        where: {
          id,
        },
        data: {
          ...data,
          ...(statusToOrderedTaskIds && {
            statusToOrderedTaskIds: statusToOrderedTaskIds as Prisma.JsonObject,
          }),
          ...(statusId && {
            status: {
              connect: {
                id: status?.id || statusId,
              },
            },
          }),
          ...(assignees && { assignees: assingeeVal }),
          // subTasks: {
          //   create: subTask,
          // },
        },
      });
    },
  },
  statusToCount: {
    async queryFn(props: any) {
      return prisma.task.groupBy({
        where: {
          projectId: props.projectId,
        },
        by: ['statusId'],
        _count: {
          id: true,
        },
        // select: { title: true },
      });
    },
  },
});
