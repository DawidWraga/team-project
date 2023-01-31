import { Flex, Spacer, Tag, TagLabel, Text } from '@chakra-ui/react';
import { Paper } from 'components/Paper';
import { Task, getListStyle } from 'views/task/Task';
import { MdAddCircle } from 'react-icons/md';
import { ITask } from 'lib-client/controllers';
import { Droppable } from 'react-beautiful-dnd';

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
  index: number;
}

export function KanbanCol(props: IProps) {
  const { tasks, status, index } = { tasks: [], ...props };

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
        <div>test</div>
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
        <Tag variant="outline" border="cyan.200" borderRadius="full" textColor={'black'}>
          {tasks?.length || 0}
        </Tag>
      </Paper>
      <Droppable
        // key={'droppable-key-' + status.id}

        droppableId={JSON.stringify(status)}
      >
        {(provided, snapshot) => (
          <Flex
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={getListStyle(snapshot.isDraggingOver)}
            // isDraggingOver={snapshot.isDraggingOver}
            key={'flex-key-' + status.id}
            flexDir={'column'}
            // h="100%"
            h="100%"
            // justifySelf="stretch"
            w="100%"
          >
            {tasks.length &&
              tasks.map((task, i) => {
                // console.log(task);
                // if (task === undefined) console.log(i);
                if (task?.id) return <Task key={task.id} task={task} index={i} />;
              })}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Flex>
  );
}
