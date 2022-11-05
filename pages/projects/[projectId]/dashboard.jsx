import { getProjectData } from 'controllers/getProjectData';
import {
	AreaChart,
	ResponsiveContainer,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Area,
	Pie,
	PieChart,
	Cell,
	Label,
} from 'recharts';
import { range } from 'utils/range';

import {
	Stat,
	StatLabel,
	StatHelpText,
	StatGroup,
	StatNumber,
	Grid,
	GridItem,
	Flex,
	Box,
	Heading,
} from '@chakra-ui/react';
import { randomNum } from 'utils/randomNum';
import { Paper } from 'styles/Paper';

export const getServerSideProps = async (ctx) => {
	const project = await getProjectData(ctx.query.projectId);
	return {
		props: { project },
	};
};

export default function ProjectDashboardPage(props) {
	const { project } = props;

	const data = range(8).map((n) => {
		const total = randomNum(10, 20);
		return {
			name: 'Week ' + (n + 1),
			Set: total,
			Completed: randomNum(5, total),
		};
	});

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
					<RenderLineChart data={data} />
				</Paper>
				<Flex h="100%" flexDir={{ base: 'column', md: 'row-reverse' }} gap="2">
					<Paper
						variant="elevated"
						justifyContent="center"
						alignItems="center"
						maxW={{ base: '100%', md: '55%' }}
					>
						<RenderPieChart pieChartData={pieChartData} />
					</Paper>
					<Stats />
				</Flex>
			</Flex>
		</div>
	);
}

function RenderLineChart(props) {
	const { data } = props;

	const colors = {
		// primary: '#38A169',
		// secondary: '#EDF2F7',
		primary: 'hsl(32, 100%, 53%)',
		secondary: 'hsl(36, 100%, 65%)',
	};

	return (
		<ResponsiveContainer width="100%">
			<AreaChart data={data}>
				<defs>
					<linearGradient id="colorSet" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor={colors.primary} stopOpacity="0.8" />
						<stop offset="95%" stopColor={colors.primary} stopOpacity="0" />
					</linearGradient>
					<linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor={colors.secondary} stopOpacity="0.8" />
						<stop offset="95%" stopColor={colors.secondary} stopOpacity="0" />
					</linearGradient>
				</defs>
				<Line type="monotone" dataKey="Set" FFB042={colors.primary} />
				<Line type="monotone" dataKey="Completed" stroke={colors.secondary} />
				<CartesianGrid strokeDasharray="5 5" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Area
					type="monotone"
					dataKey="Set"
					stroke={colors.secondary}
					fillOpacity={1}
					fill="url(#colorSet)"
				/>
				<Area
					type="monotone"
					dataKey="Completed"
					stroke={colors.primary}
					fillOpacity={1}
					fill="url(#colorCompleted)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}

function Stats(props) {
	const {} = props;

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

let renderLabel = function (entry) {
	return entry.name;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function RenderPieChart(props) {
	const { pieChartData } = props;
	return (
		<PieChart width={450} height={300}>
			<Pie
				data={pieChartData}
				dataKey="value"
				innerRadius={45}
				outerRadius={100}
				cx="50%"
				cy="50%"
				fill="#beabea"
				label={renderLabel}
			>
				{range(5).map((entry, index) => (
					<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
				))}
			</Pie>
			<Tooltip />
		</PieChart>
	);
}
