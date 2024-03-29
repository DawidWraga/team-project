import { PrismaClient, Prisma } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    errorFormat: 'colorless',
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
export { prisma };

// prisma.user.
// type Operations = Prisma.PrismaClientOptions
// const ops: Operations[] = ['find']

export type PrismaModelNames = Uncapitalize<Prisma.ModelName>;
