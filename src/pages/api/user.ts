import { IUser } from 'lib-client/controllers';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';
import { setTimeout } from 'timers/promises';

export default createApiHandler<IUser>('user', {});
