import tasks from 'db/tasks.json';
import { Flex, Box, Grid, GridItem } from '@chakra-ui/react';
import { LineChart, getLineChartDummyData } from 'components/charts/LineChart';
import { PieChart } from 'components/charts/PieChart';
import { UserTasksList } from 'components/dashboards/UserTasksList';
import { randomNum } from 'utils/randomNum';
import { Paper } from 'styles/Paper';
import { PageWrapper } from 'styles/PageWrapper';
import { RepeatClockIcon } from '@chakra-ui/icons';

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
				templateRows="repeat(2, 40vh)"
				gap={5}
				placeItems="stretch"
			>
				<GridItem colSpan={{ base: 3, lg: 2 }} overflowY={'auto'}>
					<Paper variant="elevated" h="100%">
						<UserTasksList tasks={tasks} />
					</Paper>
				</GridItem>
				<GridItem
					h="100%"
					// w={{ base: '100vw', lg: '100%' }}
					rowSpan={{ base: 3, lg: 1 }}
					order={{ base: 3, lg: 'unset' }}
				>
					<Paper
						// display="inline-block"
						w="100%"
						variant="elevated"
						h="100%"
						my="auto"
						alignItems="center"
						justifyContent="center"
					>
						<PieChart pieChartData={pieChartData} />
					</Paper>
				</GridItem>
				<GridItem colSpan={3}>
					<Paper
						w={{ base: 'calc(100vw - 60px)', lg: '100%' }}
						pr="10px"
						h="40vh"
						variant="elevated"
						overflowX="auto"
					>
						<LineChart data={lineChartData} />
					</Paper>
				</GridItem>
			</Grid>
		</div>
	);
}
