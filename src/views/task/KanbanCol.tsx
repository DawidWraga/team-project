import { Flex, Tag, Text } from '@chakra-ui/react';
import { Paper } from 'components/Paper';
import { Task } from 'views/task/Task';
import { DroppableWrapper } from 'components/DragNDrop';
import { Task as ITask } from '@prisma/client';

const statusToColorMap = {
  todo: 'red.500',
  'in-progress': 'orange.300',
  complete: 'green.400',
  done: 'green.400',
};

// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface IProps {
  tasks: ITask[];
  status: {
    label: string;
    id: number;
    projectId?: number;
  };
}

export function KanbanCol(props: IProps) {
  const { tasks, status } = { tasks: [], ...props };

  if (status.projectId) delete status.projectId;

  return (
    <Flex
      m={4}
      flexDir="column"
      // gap="1"
      // minW="300px"
      // minH={'max(70vh,500px)'}
      minH="calc(100vh - 250px)"
      border="1px solid"
      borderColor={'blackAlpha.100'}
      // w="100%"
    >
      <Paper
        w="1/3"
        variant="smooth"
        p="4"
        roundedBottom="4px"
        borderBottom="4px"
        // bg="#eeeced45"
        mx="0.5px"
        borderColor={statusToColorMap[status.label]}
      >
        <Text
          pl="0"
          fontSize={'lg'}
          pr="4"
          textTransform="uppercase"
          fontWeight="semibold"
          textAlign="center"
          onClick={() => {
            console.log(JSON.stringify(status));
          }}
        >
          {status.label}
        </Text>
        <Tag variant="outline" border="cyan.200" borderRadius="full" textColor={'black'}>
          {tasks?.length || 0}
        </Tag>
      </Paper>
      <DroppableWrapper
        id={JSON.stringify(status)}
        dropContainerProps={({ isDraggingOver }) => ({
          // background: isDraggingOver ? 'lightblue' : '#eeeced99',
          // boxShadow: isDraggingOver ? 'darklg' : 'sm',
          background: '#eeeced33',
          padding: 1,
          width: 'auto',
          flexDir: 'column',
          h: '100%',
        })}
      >
        {Boolean(tasks.length) &&
          tasks.map((task, i) => {
            if (task?.id) return <Task key={task.id} task={task} index={i} />;
          })}
      </DroppableWrapper>
    </Flex>
  );
}
