import { Tag } from '@prisma/client';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';

export default createApiHandler<Tag>('tag', {});
