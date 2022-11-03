import { Box, Flex } from '@chakra-ui/react';

export default function ProjectsHeaderContent(props) {
	const {} = props;

	const tabs = [
		{ label: 'Dashboard', route: '/dashboard' },
		{ label: 'Tasks', route: '/tasks' },
	];

	return (
		<Flex gap="5" pt="1">
			{tabs.map((tab) => {
				return (
					<Box
						color="white"
						verticalAlign={'center'}
						h="100%"
						fontSize="1.2rem"
					>
						{tab.label}
					</Box>
				);
			})}
		</Flex>
	);
}
