import { SubTask } from '@prisma/client';
import { createApiHandler } from 'lib-server/ApiController';

export default createApiHandler<SubTask>('subTask', {});
