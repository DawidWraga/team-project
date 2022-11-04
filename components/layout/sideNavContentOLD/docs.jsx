import { Box, Button, Flex, Text } from '@chakra-ui/react';

import topics from 'db/postTopics.json';

export default function SideNavContent() {
	return (
		<Box>
			{topics.map((topic, i) => (
				<Flex
					bgColor="blue.800"
					color="whiteAlpha.900"
					p="3px"
					w="100%"
					gap="3"
					key={i}
				>
					<Button
						p="3"
						variant={'ghost'}
						h="100%"
						textAlign={'left'}
						alignSelf={'center'}
						colorScheme={'whiteAlpha'}
						color="white"
					>
						<Text mr={'auto'} textAlign="left">
							{topic.name}
						</Text>
					</Button>

					<Box
						p="1"
						minW="3ch"
						bg=""
						color="whiteAlpha.900"
						alignSelf={'center'}
						textAlign={'center'}
					></Box>
				</Flex>
			))}
		</Box>
	);
}
