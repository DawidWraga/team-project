import { getProjectData } from 'controllers/getProjectData';

import {
	Stat,
	StatLabel,
	StatHelpText,
	StatGroup,
	StatNumber,
	Flex,
	Heading,
} from '@chakra-ui/react';
import { randomNum } from 'utils/randomNum';
import { Paper } from 'styles/Paper';
import { LineChart, getLineChartDummyData } from 'components/charts/LineChart';
import { PieChart } from 'components/charts/PieChart';

export const getServerSideProps = async (ctx) => {
	const project = await getProjectData(ctx.query.projectId);
	return {
		props: { project },
	};
};

export default function ProjectDashboardPage(props) {
	const { project } = props;

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
						maxW={{ base: '100%', md: '55%' }}
					>
						<PieChart pieChartData={pieChartData} />
					</Paper>
					<Stats />
				</Flex>
			</Flex>
		</div>
	);
}

function Stats(props) {
	const {} = props;

	// const statData = [
	// 	{
	// 		label: ,
	// 		number: ,
	// 		helper ,
	// 	},
	// 	{
	// 		label: ,
	// 		number: ,
	// 		helper ,
	// 	},
	// 	{
	// 		label: ,
	// 		number: ,
	// 		helper ,
	// 	},
	// 	{
	// 		label: ,
	// 		number: ,
	// 		helper ,
	// 	},
	// ]

	// statData.map(stat => <>  stat.label stat.number ....</>)

	return (
		<StatGroup
			display="flex"
			h="100%"
			w={{ base: '100%', md: '66%' }}
			flexGrow={1}
			gap="1"
			sx={{
				'& > *': {
					// minW: '200px',
					justifyContent: 'stretch',
					justifyItems: 'stretch',
					alignItems: 'stretch',
					alignContent: 'stretch',
					w: { base: '100%', lg: 'calc(50% - 10px)' },
					h: { base: 'unset', lg: '50%' },
					justifyContent: 'center',
					// w: 'clamp(40%,49%,48%)',
				},
			}}
		>
			<Paper variant="elevated" p="2">
				<Stat display="flex" alignItems={'center'} justifyContent="center">
					<StatLabel>Number of days to project deadline</StatLabel>
					<StatNumber>43 days</StatNumber>
					<StatHelpText>Deadline: 27th of December 2022</StatHelpText>
				</Stat>
			</Paper>
			<Paper variant="elevated" p="2">
				<Stat display="flex" alignItems={'center'} justifyContent="center">
					<StatLabel>Number of days to next project milestone</StatLabel>
					<StatNumber>10 days</StatNumber>
					<StatHelpText>Milestone: 20th of November 2022</StatHelpText>
				</Stat>
			</Paper>
			<Paper variant="elevated" p="2">
				<Stat display="flex" alignItems={'center'} justifyContent="center">
					<StatLabel>Number of tasks for this week</StatLabel>
					<StatNumber>38</StatNumber>
					<StatHelpText>Deadline: 27th of December 2022</StatHelpText>
				</Stat>
			</Paper>
			<Paper variant="elevated" p="2">
				<Stat display="flex" alignItems={'center'} justifyContent="center">
					<StatLabel>Number of overdue tasks</StatLabel>
					<StatNumber>7</StatNumber>
					<StatHelpText>Milestone: 20th of November 2022</StatHelpText>
				</Stat>
			</Paper>
		</StatGroup>
	);
}

// function StatsLine2(props) {
// 	const {} = props;

// 	return (
// 		<StatGroup>
// 			<Stat>
// 				<StatLabel>Number of tasks for this week</StatLabel>
// 				<StatNumber>38</StatNumber>
// 				<StatHelpText>Deadline: 27th of December 2022</StatHelpText>
// 			</Stat>
// 			<Stat>
// 				<StatLabel>Number of overdue tasks</StatLabel>
// 				<StatNumber>7</StatNumber>
// 				<StatHelpText>Milestone: 20th of November 2022</StatHelpText>
// 			</Stat>
// 		</StatGroup>
// 	);
// }
