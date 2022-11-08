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
						<LineChart
							data={lineChartData}
							// colors={{
							// 	primary: 'hsl(213.10000000000002, 93.9%, 67.8%)',
							// 	secondary: 'hsl(173.39999999999998, 80.4%, 40%)',
							// }}
						/>
					</Paper>
				</GridItem>
			</Grid>
		</div>
	);
}
