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
				<GridItem colSpan="2" overflowY={'auto'}>
					<Paper variant="elevated">
						<UserTasksList tasks={tasks} />
					</Paper>
				</GridItem>
				<GridItem bgColor="blue.100" h="100%">
					<Paper variant="elevated">
						<PieChart pieChartData={pieChartData} />
					</Paper>
				</GridItem>
				<GridItem colSpan={3} bgColor="green.100">
					<Paper w="100%" h="max-content" variant="elevated">
						<LineChart data={lineChartData} />
					</Paper>
				</GridItem>
			</Grid>
		</div>
	);
}
