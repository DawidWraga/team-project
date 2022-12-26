import tasks from 'db/tasks.json';
import { Grid, GridItem } from '@chakra-ui/react';
import { LineChart, getLineChartDummyData } from 'views/charts/LineChart';
import { PieChart } from 'views/charts/PieChart';
import { UserTasksList } from 'views/dashboard/UserTasksList';
import { randomNum } from 'utils/randomNum';
import { Paper } from 'components/Paper';

export function UserDashboard(props) {
  const {} = props;

  const lineChartData = getLineChartDummyData();

  const pieChartData = [
    {
      name: 'not started',
      value: randomNum(0, 10),
    },
    {
      name: 'in progress',
      value: randomNum(0, 10),
    },
    {
      name: 'review',
      value: randomNum(0, 10),
    },
    {
      name: 'done',
      value: randomNum(0, 10),
    },
  ];

  return (
    <div>
      <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(2, 42vh)"
        maxH="calc(95vh - 100px)"
        w="100%"
        gap={5}
        placeSelf="stretch"
        justifyContent={'stretch'}
        alignContent={'stretch'}
        alignItems={'stretch'}
      >
        <GridItem
          colSpan={{ base: '3', lg: '2' }}
          overflowY={'auto'}
          flex="auto"
          h="100%"
        >
          <Paper variant="elevated" h="100%">
            <UserTasksList tasks={tasks} />
          </Paper>
        </GridItem>
        <GridItem h="100%" colSpan={{ base: '3', lg: '1' }} overflow={'hidden'}>
          <Paper h="100%" variant="elevated" w="auto">
            <PieChart pieChartData={pieChartData} />
          </Paper>
        </GridItem>
        <GridItem colSpan={3} h="100%">
          <Paper w="100%" h="100%" variant="elevated">
            <LineChart data={lineChartData} />
          </Paper>
        </GridItem>
      </Grid>
    </div>
  );
}
