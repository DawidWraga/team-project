import { Flex, Spacer, Tag, TagLabel, Text } from '@chakra-ui/react';
import { Paper } from 'components/Paper';
import { Task, getListStyle } from 'views/task/Task';
import { MdAddCircle } from 'react-icons/md';

const statusToColorMap = {
  todo: 'red.500',
  'in-progress': 'orange.300',
  complete: 'green.400',
  done: 'green.400',
};

// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
export function KanbanCol(props) {
  const { tasks, index } = props;

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
        borderColor={statusToColorMap[props.status]}
      >
        <Text
          pl="0"
          fontSize={'lg'}
          pr="4"
          textTransform="uppercase"
          fontWeight="semibold
        "
          textAlign="center"
        >
          {props.status}
        </Text>
        <Tag variant="outline" border="cyan.200" borderRadius="full" textColor={'black'}>
          {tasks.length}
        </Tag>
      </Paper>
      <Droppable key={index} droppableId={index?.toString()}>
        {(provided, snapshot) => (
          <Flex
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={getListStyle(snapshot.isDraggingOver)}
            isDraggingOver={snapshot.isDraggingOver}
            key={index}
            flexDir={'column'}
            // h="100%"
            h="100%"
            // justifySelf="stretch"
            w="100%"
          >
            {tasks.map((task, i) => {
              return <Task key={task.id} task={task} index={i} />;
            })}
            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Flex>
  );
}
