import { Task } from '@prisma/client';
import { UNREACHABLE_ID_NUMBER } from 'lib-client/constants';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';

export default createApiHandler<Task>('task', {
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
      subTasks,
      ...data
    }) {
      const formattedAssignees = assignees?.map((user) => ({ id: user.id }));

      const createSubtasks = subTasks.filter((t) => !Boolean(t.id));
      const editSubtasks = subTasks.filter(
        (t) => Boolean(t.id) && t.description !== null && t.completed !== null
      );
      const deleteSubtaskIds = subTasks
        ?.filter((t) => t.id && t.description === null && t.completed === null)
        .map((t) => ({ id: t.id }));

      if (editSubtasks && editSubtasks.length) {
        Promise.all(
          editSubtasks.map(async ({ id, taskId, ...data }) => {
            return await prisma.subTask.update({ where: { id }, data: { ...data } });
          })
        );
      }

      return prisma.task.update({
        where: {
          id,
        },
        data: {
          ...data,

          ...(status?.id && {
            status: {
              connect: {
                id: status?.id || statusId,
              },
            },
          }),
          ...(assignees?.length && {
            assignees: { set: [], connect: formattedAssignees },
          }),
          ...(subTasks?.length && {
            subTasks: {
              ...(deleteSubtaskIds?.length && {
                deleteMany: deleteSubtaskIds,
              }),
              ...(createSubtasks?.length && {
                createMany: { data: createSubtasks },
              }),
            },
          }),
        },
      });
    },
  },

  // data is more approrpiate name for props than options becauseany queries with non-data value are prevented from running this handler; only
  upsert: {
    async queryFn(data: any) {
      const {
        id,
        status,
        statusId,
        assignees,
        projectId,
        subTasks,
        dueDate,
        description,
        title,
        ...rest
      } = data;

      console.log('TESTING, assingees ', assignees);

      const formattedAssignees = assignees?.map((user) => ({ id: user.id }));
      const deleteSubtaskIds = subTasks
        ?.filter((t) => t.id && t.description === null && t.completed === null)
        .map((t) => ({ id: t.id }));
      const createSubtasks = subTasks.filter((t) => !Boolean(t.id));
      const editSubtasks = subTasks.filter(
        (t) => Boolean(t.id) && t.description !== null && t.completed !== null
      );

      if (editSubtasks && editSubtasks.length) {
        Promise.all(
          editSubtasks.map(async ({ id, ...data }) => {
            return await prisma.subTask.update({ where: { id }, data: { ...data } });
          })
        );
      }

      return prisma.task.upsert({
        where: {
          id: id || UNREACHABLE_ID_NUMBER,
        },
        update: {
          dueDate,
          description,
          title,
          ...(statusId && {
            status: {
              connect: {
                id: status?.id || statusId,
              },
            },
          }),
          ...(assignees?.length && {
            assignees: { set: [], connect: formattedAssignees },
          }),
          ...(subTasks?.length && {
            subTasks: {
              ...(deleteSubtaskIds?.length && {
                deleteMany: deleteSubtaskIds,
              }),
              ...(createSubtasks?.length && {
                createMany: { data: createSubtasks },
              }),
            },
          }),
          ...rest,
        },
        create: {
          title: title || '',
          dueDate: dueDate || new Date(),
          description: description || '',
          status: {
            connect: {
              id: statusId || 1,
            },
          },
          assignees: {
            connect: formattedAssignees || [{ id: 1 }],
          },
          project: {
            connect: {
              id: projectId || 1,
            },
          },
          ...(subTasks?.length && {
            subTasks: {
              ...(createSubtasks?.length && {
                create: createSubtasks,
              }),
            },
          }),
          ...rest,
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
