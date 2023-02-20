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
      minH="calc(100vh - 250px)"
      border="1px solid"
      borderColor={'blackAlpha.200'}
      rounded="sm"
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
        alignItems="center"
        justifyContent={'space-between'}
      >
        <Text
          pl="0"
          fontSize={'lg'}
          pr="4"
          textTransform="uppercase"
          fontWeight="semibold"
          textAlign="center"
        >
          {status.label}
        </Text>
        <Flex
          border="1px solid lightGray"
          borderRadius="full"
          textColor={'black'}
          minW="1.63rem"
          justifyContent={'center'}
          alignItems="center"
        >
          {tasks?.length || 0}
        </Flex>
      </Paper>
      <DroppableWrapper
        id={status.id.toString()}
        dropContainerProps={({ isDraggingOver }) => ({
          // ========= can implement custom styles based on dragging state here

          // background: isDraggingOver ? 'lightblue' : '#eeeced99',
          // boxShadow: isDraggingOver ? 'darklg' : 'sm',
          background: '#eeeced33',
          padding: 1,
          width: 'auto',
          flexDir: 'column',
          display: 'flex',
          my: 1,
          h: '100%',
          gap: 2,
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
