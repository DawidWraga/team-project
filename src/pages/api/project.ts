import { UNREACHABLE_ID_NUMBER } from 'lib-client/constants';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';

export default createApiHandler('project', {
  upsert: {
    queryFn({ id, assignees, dueDate, title, statuses, ...project }) {
      const formattedAssignees = assignees?.map((user) => ({ id: user.id }));
      const deleteStatusesIds = statuses
        ?.filter((s) => s.id && s.description === null && s.completed === null)
        .map((s) => ({ id: s.id }));
      const createStatuses = statuses.filter((s) => !Boolean(s.id));
      const editStatuses = statuses.filter(
        (s) => Boolean(s.id) && s.description !== null && s.completed !== null
      );

      if (editStatuses && editStatuses.length) {
        console.log(editStatuses);
        Promise.all(
          editStatuses.map(async ({ id, ...data }) => {
            return await prisma.subTask.update({ where: { id }, data: { ...data } });
          })
        );
      }

      return prisma.project.upsert({
        where: {
          id: id || UNREACHABLE_ID_NUMBER,
        },
        update: {
          ...(assignees?.length && {
            assignees: { set: [], connect: formattedAssignees },
          }),
          dueDate,
          title,
          ...(statuses?.length && {
            statuses: {
              ...(deleteStatusesIds?.length && {
                deleteMany: deleteStatusesIds,
              }),
              ...(createStatuses?.length && {
                createMany: { data: createStatuses },
              }),
            },
          }),
          ...project,
        },
        create: {
          assignees: {
            connect: formattedAssignees || [{ id: 1 }],
          },

          statuses: {
            create: statuses,
          },
          dueDate: dueDate || new Date(),
          title: title || 'new project',

          ...project,
        },
      });
    },
  },
});

// export default createApiHandler('project', {
//   getCountByStatus: {
//     queryFn({ id }) {
//       return prisma.task.groupBy({
//         where: {
//           project: {
//             id: id,
//           },
//         },
//         by: ['statusId'],
//         _sum: {
//           statusId: true,
//         },
//       });
//     },
//   },
// });
