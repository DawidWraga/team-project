import { Flex, Heading, Text } from '@chakra-ui/react';
import { DateSelector } from 'components/DateSelector';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { useCurrentProject } from 'lib-client/hooks/useCurrentProject';
import { useFilteredTasks } from 'lib-client/hooks/useTasks';
import { useUrlData } from 'lib-client/hooks/useUrlData';
import { Loader } from '@saas-ui/react';
import {
  getProjectStatuses,
  getTasksByAssignee,
  getTasksByStatus,
} from 'utils/dashboardUtils';
import { ToggleManhours } from 'views/dashboard/ToggleManhours';
import { CustomEmptyState } from 'components/CustomEmptyState';

export default function ProjectDashboardPage(props) {
  const {} = props;

  const { data: currentProject, isLoading } = useCurrentProject();
  const { data: tasks } = useFilteredTasks();
  const { startDate, endDate } = useUrlData<{ startDate: string; endDate: string }>(
    'queryParams'
  );

  const { useSetOptionBar } = useLayoutStore();
  useSetOptionBar(
    <Flex gap={2} justifyContent={'space-between'} w="100%">
      <DateSelector />
      <ToggleManhours />
    </Flex>,
    [currentProject, [startDate, endDate].join('_')]
  );

  if (isLoading) return <Loader />;
  if (!currentProject?.id) return <CustomEmptyState title={'Project not found'} />;
  if (!tasks?.length) return <CustomEmptyState title={'No tasks found'} />;

  // ========================================================

  const { startStatus, endStatus } = getProjectStatuses(currentProject);
  const tasksInStartStatus = getTasksByStatus(tasks, startStatus.id);
  const tasksInEndStatus = getTasksByStatus(tasks, endStatus.id);

  console.log({ startStatus, endStatus, tasksInStartStatus, tasksInEndStatus });

  const assigneesTasks = getTasksByAssignee(tasks, 5);
  console.log('🔷 >> ProjectDashboardPage >> assigneesTasks', assigneesTasks);

  return (
    <Flex flexDir="column" gap={1}>
      <Flex flexDir="column">
        <Heading size="lg">Tasks statuses overall </Heading>

        <Text>start status: {tasksInStartStatus.length}</Text>
        <Text>inbetween status: {}</Text>
        <Text>end status: {}</Text>
      </Flex>
      <Flex flexDir="column">
        <Heading size="lg">Tasks statuses FOR john smith (id = 5) </Heading>

        <Text>
          start status: {getTasksByStatus(assigneesTasks, startStatus.id).length}
        </Text>
        <Text>inbetween status: {}</Text>
        <Text>end status: {getTasksByStatus(assigneesTasks, endStatus.id).length}</Text>
      </Flex>
    </Flex>
  );
}

// ========================================================

// import { randomNum } from 'utils/randomNum';
// import { Paper } from 'components/Paper';
// import { LineChart, getLineChartDummyData } from 'views/charts/LineChart';
// import { PieChart } from 'views/charts/PieChart';
// import { UserStats } from 'views/dashboard/UserStats';

// const pieChartData = [
//   {
//     name: 'not started',
//     value: randomNum(2, 10),
//   },
//   {
//     name: 'in progress',
//     value: randomNum(2, 10),
//   },
//   {
//     name: 'review',
//     value: randomNum(2, 10),
//   },
//   {
//     name: 'done',
//     value: randomNum(2, 10),
//   },
// ];
// const lineChartData = getLineChartDummyData();

// return (
//   <div>
//     <Flex flexDir="column" w="100%" h="calc(100vh - 60px)" p="10" gap="3">
//       <Paper
//         h="100%"
//         p="2"
//         flexDir="column"
//         justifyContent={'center'}
//         alignItems="center"
//         variant="elevated"
//       >
//         <Heading size="lg">Tasks this month</Heading>
//         <LineChart data={lineChartData} />
//       </Paper>
//       <Flex h="100%" flexDir={{ base: 'column', md: 'row-reverse' }} gap="2">
//         <Paper
//           variant="elevated"
//           justifyContent="center"
//           alignItems="center"
//           w={{ base: '100%', md: '50%' }}
//           // minW="300px"
//           h="100%"
//         >
//           <PieChart pieChartData={pieChartData} />
//         </Paper>
//         <UserStats />
//       </Flex>
//     </Flex>
//   </div>
// );
