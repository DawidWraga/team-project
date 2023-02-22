import { Flex, Grid, GridItem, Heading, Text, Box } from '@chakra-ui/react';
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
import {
  Card,
  Text as TremorText,
  Metric,
  Flex as TremorFlex,
  ProgressBar,
} from '@tremor/react';
import { UserList } from 'views/dashboard/UserList';
import { UrgentTasksList } from 'views/dashboard/UrgentTasksList';
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

  const OverviewValue = (props) => (
    <Box fontWeight={'bold'} fontSize={'4xl'} padding={'1'} {...props} />
  );

  const toDoTasks = tasksInStartStatus?.length;
  const completedTasks = tasksInEndStatus?.length;
  const totalTasks = tasks?.length;
  const inProgressTasks = totalTasks - toDoTasks - completedTasks;

  return (
    <Grid
      templateColumns={'repeat(3, 1fr)'}
      templateRows={'repeat(4, 1fr)'}
      gap={3}
      p={4}
    >
      <GridItem colSpan={3} rowSpan={1}>
        <Box>
          <Flex justifyContent={'center'}>
            <Flex bgColor="white" w="100%" h="100px" justifyContent={'space-between'}>
              <Flex></Flex>
              <Flex marginLeft={'10px'} marginRight={'10px'}>
                <Box margin={'1'} textAlign={'center'}>
                  <OverviewValue>{completedTasks}</OverviewValue>
                  <Box>COMPLETE</Box>
                </Box>
              </Flex>
              <OrangeSeparator></OrangeSeparator>
              <Flex marginLeft={'10px'} marginRight={'10px'}>
                <Box margin={'1'} textAlign={'center'}>
                  <OverviewValue>{inProgressTasks}</OverviewValue>
                  <Box>IN PROGRESS</Box>
                </Box>
              </Flex>
              <OrangeSeparator></OrangeSeparator>
              <Flex marginLeft={'10px'} marginRight={'10px'}>
                <Box margin={'1'} textAlign={'center'}>
                  <OverviewValue>{toDoTasks}</OverviewValue>
                  <Box>TO DO</Box>
                </Box>
              </Flex>
              <OrangeSeparator></OrangeSeparator>
              <Flex marginLeft={'10px'} marginRight={'10px'}>
                <Box margin={'1'} textAlign={'center'}>
                  <OverviewValue>{totalTasks}</OverviewValue>
                  <Box>TOTAL TASKS</Box>
                </Box>
              </Flex>
              <Flex></Flex>
            </Flex>
          </Flex>
        </Box>
      </GridItem>
      <GridItem colSpan={2} rowSpan={3} bgColor="white" rounded="md" p={2}>
        <UserList
          users={currentProject?.assignees}
          project={currentProject}
          tasks={tasks}
        />
      </GridItem>
      <GridItem colSpan={1} rowSpan={3} bgColor="white" rounded="md" p={2}>
        <UrgentTasksList
          tasks={tasks}
          closedStatuses={[currentProject.statuses[currentProject.statuses.length - 1]]}
          title="Urgent tasks"
        />
      </GridItem>
    </Grid>
  );
}

{
  /* <Flex flexDir="column">
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

<Card maxWidth="max-w-sm">
<TremorText>Sales</TremorText>
<Metric>$ 71,465</Metric>
<TremorFlex marginTop="mt-4">
  <TremorText>32% of annual target</TremorText>
  <TremorText>$ 225,000</TremorText>
</TremorFlex>
<ProgressBar percentageValue={32} marginTop="mt-2" />
</Card> */
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
const OrangeSeparator = (props) => (
  <Box
    marginTop={'10px'}
    rounded={'2xl'}
    width={'5px'}
    height={'80%'}
    bgColor={'brand.500'}
    marginRight={'5px'} // add a fixed width and adjust the margin
    {...props}
  />
);
