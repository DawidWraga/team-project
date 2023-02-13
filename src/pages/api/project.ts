import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';

export default createApiHandler('project', {
  getCountByStatus: {
    queryFn({ id }) {
      return prisma.task.findMany({
        where: {
          project: {
            id: id,
          },
        },
        select: {
          status: true,
          id: true,
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
