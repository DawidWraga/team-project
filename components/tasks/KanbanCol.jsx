import { Badge, Flex, Text } from '@chakra-ui/react';
import { Paper } from 'styles/Paper';
import { Task } from 'components/tasks/task';
import tasks from 'db/tasks';

function ColHeader() {
  return (
    <Paper
      w="1/3"
      variant="elevated"
      p="4"
      borderTop="2px"
      borderColor="blue.200"
    >
      <Text pl="0" fontSize={'lg'} pr="4" textTransform="capitalize">
        New Requests
        <Badge ml="4" variant="outline" border="cyan.200">
          4
        </Badge>
      </Text>
    </Paper>
  );
}

export function KanbanCol() {
  console.log(tasks);

  return (
    <Flex m={4} flexDir="column" gap="4" minW="400px">
      <ColHeader />
      {tasks.map((task) => {
        return <Task key={task.id} task={task} />;
      })}
    </Flex>
  );
}
