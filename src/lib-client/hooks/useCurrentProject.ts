import { useUrlData } from 'lib-client/hooks/useUrlData';
import { controller } from 'lib-client/controllers';
import { CompleteProject } from 'prisma/zod';

export function useCurrentProject() {
  const { projectId } = useUrlData<{ projectId: number }>('dynamicPath');
  const projectPrismaProps = {
    where: {
      id: projectId,
    },
    include: {
      statuses: true,
      assignees: true,
    },
  };

  return controller.useQuery({
    query: 'findUnique',
    model: 'project',
    prismaProps: projectPrismaProps,
    enabled: Boolean(projectId),
    cacheTime: 60 * 60 * 1000,
  });
}
