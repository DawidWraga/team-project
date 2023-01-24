import { Flex, Spacer, Tag, TagLabel, Text } from '@chakra-ui/react';
import { Paper } from 'components/Paper';
import { Task } from 'views/task/Task';
import { MdAddCircle } from 'react-icons/md';
import { useTaskModal } from 'views/task/useTaskModal';
const statusToColorMap = {
  todo: 'red.500',
  'in-progress': 'orange.300',
  complete: 'green.400',
};

export function KanbanCol(props) {
  const { tasks } = props;

  const { openTaskModal } = useTaskModal();

  return (
    <Flex m={4} flexDir="column" gap="4" minW="300px">
      <Paper
        w="1/3"
        variant="elevated"
        p="4"
        borderTop="4px"
        borderColor={statusToColorMap[props.status]}
      >
        <Text pl="0" fontSize={'lg'} pr="4" textTransform="uppercase" textAlign="center">
          {props.status}
        </Text>
        <Tag variant="outline" border="cyan.200" borderRadius="full" textColor={'black'}>
          {tasks.length}
        </Tag>
        <Spacer />
        <Tag
          size="md"
          variant="subtle"
          bg={statusToColorMap[props.status]}
          textColor="white"
          gap="1"
          onClick={openTaskModal}
          _hover={{ cursor: 'pointer' }}
        >
          <MdAddCircle size="18px" pl="0" pr="0" as="AddIcon" />
          <TagLabel className="uppercase">Add Task</TagLabel>
        </Tag>
      </Paper>
      {tasks.map((task) => {
        return <Task key={task.id} task={task} />;
      })}
    </Flex>
  );
}
