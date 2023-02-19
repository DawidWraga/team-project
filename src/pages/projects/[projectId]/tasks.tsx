import { Box, Button, Flex } from '@chakra-ui/react';
import { DragDropContext } from 'react-beautiful-dnd';
import {
  DateFilterDisplay,
  DateSelector,
  GotoTodayButton,
} from 'components/DateSelector';
import { useUrlData } from 'lib-client/hooks/useUrlData';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { KanbanCol } from 'views/task/KanbanCol';
import { useTaskModal } from 'views/task/useTaskModal';
import { useCurrentProject } from 'lib-client/hooks/useCurrentProject';
import { useFilteredTasks, useUpdateTask } from 'lib-client/hooks/useTasks';
import { Loader } from '@saas-ui/react';
import { headerHeight, optionBarHeight } from 'lib-client/constants';
import { ToggleOnlyMe } from 'components/ToggleOnlyMe';
import { useFilterStore } from 'lib-client/stores/FilterStore';
import { getTasksByAssignee } from 'utils/dashboardUtils';
import { useUser } from 'lib-client/hooks/useUser';
import { FilterMenuButton } from 'components/FilterMenu';

export default function ProjectKanbanPage() {
  const { startDate, endDate } = useUrlData<{ startDate: string; endDate: string }>(
    'queryParams'
  );

  const { onlyMe } = useFilterStore();
  const user = useUser();

  const { openTaskModal } = useTaskModal();
  const { data: currentProject } = useCurrentProject();
  const { data: tasks } = useFilteredTasks({
    // if only me, filter tasks by user id
    ...(onlyMe &&
      user?.id && {
        select: (tasks) => {
          return getTasksByAssignee(tasks, user?.id);
        },
      }),
  });
  const { mutateAsync: updateTask } = useUpdateTask();

  const { useSetOptionBar } = useLayoutStore();
  useSetOptionBar(
    <Flex gap={2} justifyContent={'space-between'} alignItems="center" w="100%" pr={2}>
      <Flex>
        <DateSelector
          buttonDesktopOnly={true}
          dateDisplayProps={{ showTodayButton: true }}
        />
      </Flex>

      <Flex gap={2} alignItems="center">
        <ToggleOnlyMe
          containerProps={{ sx: { display: { base: 'none', md: 'flex' } } }}
        />
        <Button
          colorScheme={'brand'}
          variant={'solid'}
          onClick={() => {
            openTaskModal();
          }}
          sx={{
            position: { base: 'fixed', md: 'static' },
            bottom: { base: 2 },
            right: { base: 2 },
          }}
        >
          Add task
        </Button>
        <FilterMenuButton
          iconButtonProps={{ sx: { mr: 2 } }}
          content={
            <Flex gap={4} flexDir="column">
              <ToggleOnlyMe
                containerProps={{ justifyContent: 'space-between', w: '80%', mx: 'auto' }}
              />
              <Flex gap={2} flexDir="column" justifyContent="center" alignItems="center">
                <DateSelector textDesktopOnly={true} />
                <DateFilterDisplay containerProps={{ justifyContent: 'center' }} />
              </Flex>
            </Flex>
          }
        />
      </Flex>
    </Flex>,
    [currentProject, [startDate, endDate].join('_')]
  );

  if (!currentProject) return <Loader />;

  async function onDragEnd({ draggableId, source, destination }) {
    // GUARD CLAUSES
    const isDroppedOutsideList = !destination;
    if (isDroppedOutsideList) return;

    const noChangesMade =
      source.droppableId === destination.droppableId &&
      source.index === destination.index;

    if (noChangesMade) return;

    // create new task from parsed data
    const task = JSON.parse(draggableId);
    if (task.statusId) delete task.statusId;
    const prevStatus = JSON.parse(source.droppableId);
    const newStatus = JSON.parse(destination.droppableId);

    const isStatusChange = prevStatus.id !== newStatus.id;

    // update task status in database
    if (isStatusChange) {
      const newTask = {
        ...task,
        status: newStatus,
      };

      updateTask(newTask);
    }
  }

  function getTasksByStatusId(statusId) {
    if (!tasks || !currentProject) return [];
    return tasks?.filter((t) => t?.status?.id === statusId) || [];
  }

  return (
    <>
      <Box
        display="grid"
        bg="whiteAlpha.700"
        minW={(currentProject?.statuses?.length || 3) * 400}
        gridTemplateColumns={`repeat(${
          currentProject?.statuses?.length || 3
        }, minmax(200px , 400px))`}
        w="100%"
        justifyContent={'start'}
        minH={`calc(100vh - ${headerHeight + optionBarHeight}px)`}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {((currentProject as any)?.statuses).map((status, i) => {
            return (
              <KanbanCol
                key={status.id}
                status={status}
                tasks={getTasksByStatusId(status.id) as any}
              />
            );
          })}
        </DragDropContext>
      </Box>
    </>
  );
}
