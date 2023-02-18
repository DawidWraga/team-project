import { Controller } from 'lib-client/controllers/Controller';
import { IPartialQueryConfigs } from 'lib-client/controllers/types/Controller';
import * as Prisma from '@prisma/client';
import * as T from 'prisma/zod';

export type PrismaModelNamesToTypes = {
  project: T.CompleteProject;
  task: T.CompleteTask;
  subTask: T.CompleteSubTask;
  taskStatus: T.CompleteTaskStatus;
  example: Prisma.Example;
  user: T.CompleteUser;
  userRole: T.CompleteUserRole;
  post: T.CompletePost;
  comment: T.CompleteComment;
  invitation: Prisma.Invitation;
  anyModel: any;
  account: never;
  session: never;
  verificationToken: never;
};
export const queryConfigs: IPartialQueryConfigs<PrismaModelNamesToTypes> = {
  anyModel: {
    anyWriteQuery: {
      mode: 'server',
      invalidateClientChanges: false,
      getChangeUiKey: (config) => [config.model, 'findMany'],
      logConfig: false,
    },
    anyReadQuery: {
      prismaProps: {},
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      logConfig: false,
      staleTime: 5 * 60 * 1000, //min*sec*ms,
    },
    create: {},
  },
};
export const controller = new Controller();
