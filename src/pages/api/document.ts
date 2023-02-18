import { Document } from '@prisma/client';
import { createApiHandler } from 'lib-server/ApiController';
import { prisma } from 'lib-server/prisma';

export default createApiHandler<Document>('document', {
  create: {
    queryFn: async ({ content, tags, authorId, ...data }) => {
      return await prisma.document.create({
        data: {
          ...data,
          content: Buffer.from(content, 'utf8'),
          authors: {
            connect: {
              id: authorId,
            },
          },
          ...(tags?.length > 0 && {
            tags: {
              connect: tags.map(({ value }) => ({ id: value })),
            },
          }),
        },
      });
    },
  },
  findUnique: {
    queryFn: async ({ id }) => {
      const doc = await prisma.document.findUnique({
        where: {
          id,
        },
        include: {
          authors: true,
          tags: true,
        },
      });

      (doc as any).content = doc.content.toString('utf8');
      return doc;
    },
  },
});
