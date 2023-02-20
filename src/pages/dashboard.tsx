import { PageWrapper } from 'layouts/PageWrapper';
import { DateInput } from 'components/DateInput';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useUser } from 'lib-client/hooks/useUser';
import { useRouter } from 'next/router';
import { Card, ColGrid, Col, Block, DeltaType } from '@tremor/react';
import { Box, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import { LinechartCard } from 'views/dashboard/LinechartCard';
import { getDatesInRange } from 'utils/getDatesInRange';
import moment from 'moment';
import { Task } from '@prisma/client';
import { getTasksGroupedByDates } from 'utils/getTasksGroupedByDates';
import {
  getClosedStatuses,
  getClosedTasks,
  getTasksGroupedByStatuses,
} from 'utils/getTasksGroupedByStatuses';
import { Loader } from '@saas-ui/react';
import { CustomEmptyState } from 'components/CustomEmptyState';
import { UrgentTasksList } from 'views/dashboard/UrgentTasksList';
export default function DashboardPage(props) {
  const {} = props;

  const user = useUser();
  const tasks = user?.tasksAssigned;
  const projects = user?.projectsAssigned;

  if (!user?.id) return <Loader />;
  if (!tasks?.length) return <CustomEmptyState title="no assinged tasks found" />;
  if (!projects?.length) return <CustomEmptyState title="no assigned projects found" />;

  const closedStatuses = getClosedStatuses(projects as any);
  const tasksByDate = getTasksGroupedByDates(tasks, 3, 'month');

  const linechartData = tasksByDate.map(({ date, tasks }) => {
    const closedTasks = getClosedTasks(tasks, closedStatuses);
    return {
      Month: moment(date).format('MMM YY'),
      Productivity: closedTasks.length,
      Workload: tasks.length,
    };
  });

  const last = linechartData[linechartData.length - 1];
  const prev = linechartData[linechartData.length - 2];

  const productivityData = getDelta(last.Productivity, prev.Productivity);
  const workloadData = getDelta(last.Workload, prev.Workload);

  const categories: {
    title: string;
    metric: string;
    metricPrev: string;
    delta: string;
    deltaType: DeltaType;
  }[] = [
    {
      title: 'Productivity',
      metric: `${last.Productivity} tasks completed`,
      metricPrev: `${prev.Productivity} last month`,
      delta: `${productivityData.percent}%`,
      deltaType: productivityData.deltaType,
    },
    {
      title: 'Workload',
      metric: `${last.Workload} tasks assigned`,
      metricPrev: `${prev.Workload} last month`,
      delta: `${workloadData.percent}%`,
      deltaType: workloadData.deltaType,
    },
  ];

  return (
    <Box as="main" w="100%" h="100%" p={2}>
      <Heading>
        <Box as="span" textTransform={'capitalize'} mr="1.5">
          {user?.fullName.split(' ')[0]}'s
        </Box>
        productivity dashboard
      </Heading>
      <Text>A summary of your performance during the past 3 months</Text>

      <Grid
        h="calc(100% - 4rem)"
        templateColumns={'repeat(2, 1fr)'}
        templateRows={'repeat(2, 1fr)'}
        gap={6}
      >
        {/* Main section */}
        <GridItem colSpan={1} rowSpan={2}>
          <Card hFull={true}>
            {/* <Box w="100%" h="100%"></Box> */}
            <UrgentTasksList tasks={tasks} closedStatuses={closedStatuses} />
          </Card>
        </GridItem>

        {/* KPI sidebar */}
        {categories.map((d) => {
          return (
            <GridItem colSpan={1} rowSpan={1} key={JSON.stringify(d)}>
              <LinechartCard {...d} linechartData={linechartData} />
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
}

const data = [
  // {
  //   Month: 'Jan 21',
  //   Sales: 2890,
  //   Profit: 2400,
  //   Customers: 4938,
  // },
  // {
  //   Month: 'Feb 21',
  //   Sales: 1890,
  //   Profit: 1398,
  //   Customers: 2938,
  // },
  {
    Productivity: 30,
    Workload: 25,
    Month: 'Mar 21',
  },
  {
    Productivity: 25,
    Workload: 20,
    Month: 'Feb 21',
  },
  {
    Productivity: 28,
    Workload: 26,
    Month: 'Jan 21',
  },
  {
    Productivity: 29,
    Workload: 24,
    Month: 'Dec 20',
  },
];

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

function getDelta(a: number, b: number, deltaThreshold = 25) {
  const delta = a - b;

  const percent = Math.round((delta / (a || 1)) * 100);

  let deltaType: DeltaType;

  // positive handlers
  if (delta > 0) {
    if (percent > deltaThreshold) {
      deltaType = 'increase';
    } else {
      deltaType = 'moderateIncrease';
    }
    // negative handlers
  } else if (delta < 0) {
    if (percent < deltaThreshold) {
      deltaType = 'decrease';
    } else {
      deltaType = 'moderateDecrease';
    }
    // no change
  } else {
    deltaType = 'unchanged';
  }

  return { delta, percent, deltaType };
}
