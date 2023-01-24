import { createApiHandler } from 'lib-server/ApiController';

export default createApiHandler('project', {
  findMany: {
    formatPrismaOptions: (options) => options,
  },
});
