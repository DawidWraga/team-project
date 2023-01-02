import { Box } from '@chakra-ui/react';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { KanbanCol } from 'views/task/KanbanCol';
const tasks = require('db/tasks.json');

export default function ProjectKanbanPage(props) {
  const {} = props;

  // const { setOptionBar } = useLayoutStore();
  // setOptionBar(<>testing!</>);

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, minmax(200px , 1fr))"
      overflowX="auto"
      justifyContent={'center'}
    >
      {['todo', 'in-progress', 'complete'].map((status) => {
        const relevantTasks = tasks.filter((task) => task.status === status);
        return <KanbanCol key={status} status={status} tasks={relevantTasks} />;
      })}
    </Box>
  );
}
