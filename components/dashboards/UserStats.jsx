import {
	StatGroup,
	StatLabel,
	StatNumber,
	StatHelpText,
	Stat,
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
