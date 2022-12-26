import { Box } from '@chakra-ui/react';
import React from 'react';
import { KanbanCol } from 'views/task/KanbanCol';
import tasks from 'db/tasks';

export default function ProjectKanbanPage(props) {
  const {} = props;
  return (
    <Box display="grid" gridTemplateColumns="repeat(3,1fr)" overflowX="auto">
      {['todo', 'in-progress', 'complete'].map((status) => {
        const relevantTasks = tasks.filter((task) => task.status === status);
        return <KanbanCol key={status} status={status} tasks={relevantTasks} />;
      })}
    </Box>
  );
}
