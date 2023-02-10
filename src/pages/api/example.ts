import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';

export default createApiHandler('example', {
  create: {},
});
