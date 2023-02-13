import { useUrlData } from 'lib-client/hooks/useUrlData';
import { controller } from 'lib-client/controllers';

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

  return controller.use({
    query: 'findUnique',
    model: 'project',
    prismaProps: projectPrismaProps,
    enabled: Boolean(projectId),
    cacheTime: 60 * 60 * 1000,
  });
}
