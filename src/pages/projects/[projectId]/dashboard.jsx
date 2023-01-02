import { randomNum } from 'utils/randomNum';
import { Paper } from 'components/Paper';
import { LineChart, getLineChartDummyData } from 'views/charts/LineChart';
import { PieChart } from 'views/charts/PieChart';
import { UserStats } from 'views/dashboard/UserStats';
import { Flex, Heading } from '@chakra-ui/react';

// export const getServerSideProps = async (ctx) => {
// 	const project = await getProjectData(ctx.query.projectId);
// 	return {
// 		props: { project },
// 	};
// };

export default function ProjectDashboardPage(props) {
  const {} = props;

  // const { isOpen, onLoad } = useDisclosure();

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
