import { randomNum } from 'utils/randomNum';
import { Paper } from 'components/Paper';
import { LineChart, getLineChartDummyData } from 'views/charts/LineChart';
import { PieChart } from 'views/charts/PieChart';
import { UserStats } from 'views/dashboard/UserStats';
import { Flex, Heading } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';

import { DateSelector } from 'components/DateSelector';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { useCurrentProject } from 'lib-client/hooks/useCurrentProject';
import { useFilteredTasks, useUpdateTask } from 'lib-client/hooks/useTasks';
import { useUrlData } from 'lib-client/hooks/useUrlData';

export default function ProjectDashboardPage(props) {
  const {} = props;

  const { data: currentProject } = useCurrentProject();
  const { data: tasks } = useFilteredTasks();
  const { startDate, endDate } = useUrlData<{ startDate: string; endDate: string }>(
    'queryParams'
  );

  const { useSetOptionBar, leftOffset, sideNavIsOpen } = useLayoutStore();
  useSetOptionBar(
    <Flex
      gap={2}
      justifyContent={'space-between'}
      w="100%"
      mr={sideNavIsOpen ? leftOffset : 0}
      transition={'margin-right 200ms ease-in-out'}
      color="shade.main"
    >
      <DateSelector />
      <Flex gap={2}>
        <Button
          colorScheme={'brand'}
          variant={'solid'}
          // onClick={() => {
          //   openTaskModal();
          // }}
        >
          Add task
        </Button>
      </Flex>
    </Flex>,
    [currentProject, sideNavIsOpen, [startDate, endDate].join('_')]
  );
  const lineChartData = getLineChartDummyData();

  const pieChartData = [
    {
      name: 'not started',
      value: randomNum(2, 10),
    },
    {
      name: 'in progress',
      value: randomNum(2, 10),
    },
    {
      name: 'review',
      value: randomNum(2, 10),
    },
    {
      name: 'done',
      value: randomNum(2, 10),
    },
  ];

  return (
    <div>
      <Flex flexDir="column" w="100%" h="calc(100vh - 60px)" p="10" gap="3">
        <Paper
          h="100%"
          p="2"
          flexDir="column"
          justifyContent={'center'}
          alignItems="center"
          variant="elevated"
        >
          <Heading size="lg">Tasks this month</Heading>
          <LineChart data={lineChartData} />
        </Paper>
        <Flex h="100%" flexDir={{ base: 'column', md: 'row-reverse' }} gap="2">
          <Paper
            variant="elevated"
            justifyContent="center"
            alignItems="center"
            w={{ base: '100%', md: '50%' }}
            // minW="300px"
            h="100%"
          >
            <PieChart pieChartData={pieChartData} />
          </Paper>
          <UserStats />
        </Flex>
      </Flex>
    </div>
  );
}
