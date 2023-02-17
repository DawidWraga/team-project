import { Box, Button, Flex } from '@chakra-ui/react';
import { DragDropContext } from 'react-beautiful-dnd';

import { DateSelector } from 'components/DateSelector';
// import { projectController, taskController } from 'lib-client/controllers';
import { useUrlData } from 'lib-client/hooks/useUrlData';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { KanbanCol } from 'views/task/KanbanCol';
import { useTaskModal } from 'views/task/useTaskModal';
import { useCurrentProject } from 'lib-client/hooks/useCurrentProject';
import { useFilteredTasks, useUpdateTask } from 'lib-client/hooks/useTasks';

export default function ProjectKanbanPage() {
  const { startDate, endDate } = useUrlData<{ startDate: string; endDate: string }>(
    'queryParams'
  );

  const { openTaskModal } = useTaskModal();
  const { data: currentProject } = useCurrentProject();
  const { data: tasks } = useFilteredTasks();
  const { mutateAsync: updateTask } = useUpdateTask();

  const { useSetOptionBar, leftOffset, sideNavIsOpen } = useLayoutStore();
  useSetOptionBar(
    <Flex
      gap={2}
      justifyContent={'space-between'}
      w="100%"
      mr={sideNavIsOpen ? leftOffset : 0}
      transition={'margin-right 200ms ease-in-out'}
      color="shade.main"
    >
      <DateSelector />
      <Flex gap={2}>
        <Button
          colorScheme={'brand'}
          variant={'solid'}
          onClick={() => {
            openTaskModal();
          }}
        >
          Add task
        </Button>
      </Flex>
    </Flex>,
    [currentProject, sideNavIsOpen, [startDate, endDate].join('_')]
  );

  async function onDragEnd({ draggableId, source, destination }) {
    const isDroppedOutsideList = !destination;
    if (isDroppedOutsideList) return;

    const noChangesMade =
      source.droppableId === destination.droppableId &&
      source.index === destination.index;

    if (noChangesMade) return;

    const task = JSON.parse(draggableId);
    if (task.statusId) delete task.statusId;
    const prevStatus = JSON.parse(source.droppableId);
    const newStatus = JSON.parse(destination.droppableId);

    // const kanbanOrderIndex = destination.index;

    const isStatusChange = prevStatus.id !== newStatus.id;

    const statusToOrderedTaskIds =
      currentProject.statusToOrderedTaskIds ||
      Object.fromEntries(
        currentProject.statuses.map((s) => [
          s.id,
          [tasks.filter((t) => t.status.id === s.id)],
        ])
      );

    if (isStatusChange) {
      const newTask = {
        ...task,
        status: newStatus,
      };
      // console.log({ task, newStatus, newTask, statusToOrderedTaskIds, prevStatus });

      // // 1. Remove the task from the previous status' array
      // statusToOrderedTaskIds[prevStatus.id] = statusToOrderedTaskIds[
      //   prevStatus.id
      // ]?.filter((id) => id !== newTask.id);
      // // 2. Add the task to the new status' array
      // statusToOrderedTaskIds[newStatus.id].push(newTask.id);

      updateTask(newTask);
    }

    // if (true) {
    //   const reordered = {
    //     ...(statusToOrderedTaskIds || {}),
    //     [newStatus.id]: reorder(
    //       statusToOrderedTaskIds[newStatus.id] || [],
    //       source.index,
    //       destination.index
    //     ),
    //   };

    //   console.log('==============TASKS===============');
    //   console.log('prev');
    //   console.table(statusToOrderedTaskIds);
    //   console.log('new');
    //   console.table(reordered);
    //   console.log('==================================');

    //   updateProject({ id: projectId, statusToOrderedTaskIds: reordered });
    // }
  }

  if (!currentProject) return <>loading...</>;

  // function getTaskById(id) {
  //   return tasks.find((t) => t.id === id);
  // }

  // function getAllTasksByStatusId(statusId) {
  //   return tasks.filter((t) => t.status.id === statusId);
  // }

  // function getOrderedTasksByStatusId(statusId) {
  //   const ordered = currentProject?.statusToOrderedTaskIds?.[statusId];
  //   if (!ordered) return getAllTasksByStatusId(statusId);
  //   return ordered.map((id) => getTaskById(id));
  // }

  function getRelevantTasks(statusId) {
    if (!tasks || !currentProject) return [];
    return tasks?.filter((t) => t?.status?.id === statusId) || [];

    const ordered = currentProject?.statusToOrderedTaskIds?.[statusId];
    if (!ordered) {
      // console.log('ordered not found:', ordered, tasks, statusId);
      return tasks?.filter((t) => t.status.id === statusId) || [];
    }

    return ordered.map((taskId) => tasks.find((task) => task.id === taskId));
    // if (ordered && relevantTasks && relevantTasks.length) {
    // const idToTask = {};
    // relevantTasks?.forEach((task) => (idToTask[task.id] = task));

    // // console.log("id to task: ",idToTask)

    // relevantTasks = ordered.map((taskId) => idToTask[taskId]);
    // }
  }

  return (
    <>
      <Box
        display="grid"
        bg="whiteAlpha.700"
        // w="100%"
        minW={(currentProject?.statuses?.length || 3) * 400}
        gridTemplateColumns={`repeat(${
          currentProject?.statuses?.length || 3
        }, minmax(200px , 400px))`}
        // overflowX="auto"
        overflow="visible"
        justifyContent={'start'}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {((currentProject as any)?.statuses).map((status, i) => {
            return (
              <KanbanCol
                key={status.id}
                status={status}
                tasks={getRelevantTasks(status.id)}
              />
            );
          })}
        </DragDropContext>
      </Box>
    </>
  );
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  // console.log({ source, destination, droppableSource, droppableDestination });
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone?.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
