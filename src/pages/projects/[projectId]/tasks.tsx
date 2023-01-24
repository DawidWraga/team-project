import { Box, Button } from '@chakra-ui/react';
import { DateSelector } from 'components/DateSelector';
import { taskController } from 'lib-client/controllers';
import { useNextQueryParams, useUrlData } from 'lib-client/hooks/useNextQueryParams';
import { useUrlDateToPrismaOptions } from 'lib-client/hooks/useUrlDateToPrismaOptions';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { useRouter } from 'next/router';
import { KanbanCol } from 'views/task/KanbanCol';
import { useProjectModal } from 'views/task/useProjectModal';
// const tasks = require('db/tasks.json');

export default function ProjectKanbanPage() {
  const { projectId } = useUrlData<{ projectId: number }>('dynamicPath');

  const { openProjectModal } = useProjectModal();

  const { useSetOptionBar } = useLayoutStore();
  useSetOptionBar(
    <>
      <DateSelector />
      <Button variant={'solid'} colorScheme={'brand'} onClick={openProjectModal}>
        new project
      </Button>
    </>
  );

  const { data: tasks } = taskController.useQuery('findMany', {
    prismaQueryOptions: {
      where: {
        dueDate: useUrlDateToPrismaOptions(),
        project: {
          id: projectId,
        },
      },
      include: {
        status: true,
      },
    },
  });

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, minmax(200px , 1fr))"
      overflowX="auto"
      justifyContent={'center'}
    >
      {['todo', 'in-progress', 'complete'].map((status) => {
        const relevantTasks = tasks?.filter((task) => task.status.label === status) || [];
        return <KanbanCol key={status} status={status} tasks={relevantTasks} />;
      })}
    </Box>
  );
}
