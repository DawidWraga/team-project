import {
  Badge,
  Flex,
  Spacer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
} from '@chakra-ui/react';
import { Paper } from 'styles/Paper';
import { Task } from 'components/tasks/task';
import { MdAddCircle } from 'react-icons/md';

const statusToColorMap = {
  todo: 'red.500',
  'in-progress': 'orange.300',
  complete: 'green.400',
};

export function KanbanCol(props) {
  const { tasks } = props;
  return (
    <Flex m={4} flexDir="column" gap="4" minW="400px">
      <Paper
        w="1/3"
        variant="elevated"
        p="4"
        borderTop="4px"
        borderColor={statusToColorMap[props.status]}
      >
        <Text
          pl="0"
          fontSize={'lg'}
          pr="4"
          textTransform="uppercase"
          textAlign="center"
        >
          {props.status}
        </Text>
        <Tag
          variant="outline"
          border="cyan.200"
          borderRadius="full"
          textColor={'black'}
        >
          {tasks.length}
        </Tag>
        <Spacer />
        <Tag
          size="md"
          variant="subtle"
          bg={statusToColorMap[props.status]}
          textColor="white"
          gap="1"
        >
          <MdAddCircle size="18px" pl="0" pr="0" as="AddIcon" />
          <TagLabel class="uppercase">Add Task</TagLabel>
        </Tag>
      </Paper>
      {tasks.map((task) => {
        return <Task key={task.id} task={task} />;
      })}
    </Flex>
  );
}
