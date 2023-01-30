import { Box, Button, Flex } from '@chakra-ui/react';
import { DragDropContext } from 'react-beautiful-dnd';

import { DateSelector } from 'components/DateSelector';
import { projectController, taskController } from 'lib-client/controllers';
import { useUrlData } from 'lib-client/hooks/useNextQueryParams';
import { useUrlDateToPrismaOptions } from 'lib-client/hooks/useUrlDateToPrismaOptions';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { KanbanCol } from 'views/task/KanbanCol';
import { useProjectModal } from 'views/task/useProjectModal';
import { useTaskModal } from 'views/task/useTaskModal';
import { useEffect, useState } from 'react';

export default function ProjectKanbanPage() {
  const { projectId } = useUrlData<{ projectId: number }>('dynamicPath');
  const { startDate, endDate } = useUrlData<{ startDate: string; endDate: string }>(
    'queryParams'
  );

  const { data: currentProject } = projectController.useQuery('findUnique', {
    prismaProps: {
      where: {
        id: projectId,
      },
      include: {
        statuses: true,
        assignees: true,
      },
    },
    cacheTime: 60 * 60 * 1000,
  });

  const { openProjectModal } = useProjectModal();
  const { openTaskModal } = useTaskModal();

  const { mutateAsync: updateTask } = taskController.useMutation('update', {
    mutationKey: ['dont-update'],
  });

  const { useSetOptionBar, leftOffset, sideNavIsOpen } = useLayoutStore();
  useSetOptionBar(
    (
      <Flex
        gap={2}
        justifyContent={'space-between'}
        w="100%"
        mr={sideNavIsOpen ? leftOffset : 0}
        transition={'margin-right 200ms ease-in-out'}
        color="shade.main"
        // bg="white"
        // borderBottom={'1px solid gray'}
      >
        <DateSelector />
        <Flex gap={2}>
          {/* <Button variant={'solid'} colorScheme={'brand'} onClick={openProjectModal}>
          new project
        </Button>
        <Button
          colorScheme={'blackAlpha'}
          variant={'solid'}
          onClick={() => {
            openProjectModal({ defaultValues: currentProject });
          }}
        >
          Edit project
        </Button> */}
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
      </Flex>
    ) as any,
    [currentProject, sideNavIsOpen, [startDate, endDate].join('_')]
  );

  const { data: tasks } = taskController.useQuery('findMany', {
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
      },
    },
  });

  const statusLabels = currentProject?.statuses?.map((s) => s.label);

  const [state, setState] = useState(tasks ? formatTasks(tasks, statusLabels) : []);

  useEffect(() => {
    if (!statusLabels?.length) return;

    // if number of tasks not changed, prevent rerender (keeps order in col )
    if (tasks?.length === state.reduce((acc, col) => acc + col.length, 0)) return;

    const newState = formatTasks(tasks || [], statusLabels);
    // statusLabels.forEach((s, i) => console.table(`${s}: `, newState[i]));
    setState(newState);
  }, [tasks, currentProject]);

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sourceId = +source.droppableId;
    const destinationId = +destination.droppableId;

    console.log({ source, destination, sourceId, destinationId });

    if (sourceId === destinationId) {
      const items = reorder(state[sourceId], source.index, destination.index);
      const newState = [...state];
      newState[sourceId] = items;
      setState(newState);
    } else {
      // console.log({sourceId,destinationId})
      const result = move(state[sourceId], state[destinationId], source, destination);
      // const result = reorder(result1, source.index, destination.index);

      const statusIndex = destination.droppableId;
      const statusId = (currentProject as any)?.statuses?.[statusIndex].id;
      const targetTaskId = state[sourceId][source.index].id;

      updateTask({ statusId, id: targetTaskId });
      // console.log({ statusIndex, statusId, targetTaskId });

      const newState = [...state];
      newState[sourceId] = result[sourceId];
      newState[destinationId] = result[destinationId];

      // console.log('SET STATE TO: ', newState);

      setState(newState);
      // console.log('SET ONECE');
      // setState(newState.filter((group) => group.length));
    }
  }

  return (
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
        {((currentProject as any)?.statuses || defaultStatuses).map((status, i) => {
          return (
            <KanbanCol
              key={status.id}
              status={status.label}
              tasks={state[i] || []}
              index={i}
            />
          );
        })}
      </DragDropContext>
    </Box>
  );
}

const defaultStatuses = [
  { label: 'todo', id: 1 },
  { label: 'in-progress', id: 2 },
  { label: 'done', id: 3 },
];

function formatTasks(tasks: any[], columns: string[]) {
  if (!tasks) return;
  if (!columns) return;

  const initalObj = Object.fromEntries(columns.map((label) => [label, []]));
  const formatted = Object.values(
    tasks.reduce((acc, task) => {
      const newAcc = { ...acc };

      if (!newAcc[task.status.label]) newAcc[task.status.label] = [];

      newAcc[task.status.label].push(task);

      return newAcc;
    }, initalObj as Record<string, Record<any, any>[]>)
  );

  const final = formatted.map((k) => Object.values(k));

  while (columns.length > final.length) {
    final.push([]);
  }

  return final;
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
