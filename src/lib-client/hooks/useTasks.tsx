// import { projectController, taskController } from 'lib-client/controllers';
import { useUrlData } from 'lib-client/hooks/useUrlData';
import { useUrlDateToPrismaOptions } from 'lib-client/hooks/useUrlDateToPrismaOptions';
import { controller } from 'lib-client/controllers';
import { ICustomUseQueryOptions } from 'lib-client/controllers/types/Controller';
import { CompleteTask } from 'prisma/zod';

type IUseFilteredTasksProps = Omit<
  ICustomUseQueryOptions<CompleteTask[]>,
  'query' | 'model'
>;

export function useFilteredTasks(props?: IUseFilteredTasksProps) {
  const { projectId } = useUrlData<{ projectId: number }>('dynamicPath');

  return controller.useQuery<'findMany', 'task', CompleteTask, CompleteTask[]>({
    model: 'task',
    query: 'findMany',
    prismaProps: {
      where: {
        dueDate: useUrlDateToPrismaOptions(),
        project: {
          id: projectId,
        },
      },
      include: {
        status: true,
        assignees: true,
        subTasks: true,
      },
    },
    enabled: Boolean(projectId),
    ...(props as any),
  });
}

// This hook wraps the useMutation hook from the controller package, and
// adds some additional functionality. It returns a mutate function, which
// can be used to update a task. It also adds a queryKey to the options
// object, which is used to invalidate the cache after the task is updated.

export function useUpdateTask(options?: any) {
  const { queryKey } = useFilteredTasks();

  return controller.useMutation({
    model: 'task',
    query: 'update',
    mode: 'optimistic',
    changeUiKey: queryKey,
    changeUiType: 'array',
    invalidateClientChanges: true,
    ...options,
  });
}
export function useUpdateSubTask(options?: any) {
  const { queryKey } = useFilteredTasks();

  return controller.useMutation({
    model: 'subTask',
    query: 'update',
    mode: 'optimistic',
    changeUiKey: queryKey,
    changeUiType: 'array',
    invalidateClientChanges: true,
    ...options,
  });
}
