import {
	StatGroup,
	StatLabel,
	StatNumber,
	StatHelpText,
	Stat,
	StatArrow,
	Box,
} from '@chakra-ui/react';

import { Paper } from 'styles/Paper';

export function UserStats(props) {
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

	const CustomStat = (props) => {
		return (
			<Stat
				display="flex"
				alignItems={'center'}
				justifyContent="center"
				minW="200px"
				sx={{
					'& .chakra-stat__label': {
						fontSize: '1.3rem',
						py: 1,
					},

					'& .chakra-stat__number': {
						fontSize: '1.9rem',
						py: 1,
					},
					'& .chakra-icon': {
						fontSize: '15rem',
						height: '28px',
						width: '18px',
					},
					'& .customText': {
						fontSize: '1.5rem',
						textColor: 'gray.600',
					},
				}}
			>
				{props.children}
			</Stat>
		);
	};

	return (
		<StatGroup
			display="flex"
			h="100%"
			gap="1"
			w="100%"
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
				<CustomStat>
					<StatLabel>Project deadline</StatLabel>
					<StatNumber>43 days</StatNumber>
					<StatHelpText>27th of December 2022</StatHelpText>
				</CustomStat>
			</Paper>
			<Paper variant="elevated" p="2">
				<CustomStat>
					<StatLabel>Next project milestone</StatLabel>
					<StatNumber>10 days</StatNumber>
					<StatHelpText>20th of November 2022</StatHelpText>
				</CustomStat>
			</Paper>
			<Paper variant="elevated" p="2">
				<CustomStat>
					<StatLabel>Tasks for this week</StatLabel>
					<StatNumber>
						38
						<Box className="inline-block ml-5 customText">
							<StatArrow type="increase" />
							15.7%
						</Box>
					</StatNumber>
				</CustomStat>
			</Paper>
			<Paper variant="elevated" p="2">
				<CustomStat>
					<StatLabel>Overdue tasks</StatLabel>
					<StatNumber>
						7
						<Box className="inline-block ml-5 customText">
							<StatArrow type="decrease" />
							9.2%
						</Box>
					</StatNumber>
				</CustomStat>
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
