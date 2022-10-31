import { toast } from 'react-toastify';
import { Button, Box, Image, Heading, Text, Flex } from '@chakra-ui/react';

export function Card(props) {
	const { title, src } = props;

	return (
		<Box bgColor="gray.500" w={{ base: '150px', sm: '200px' }} minH="120px">
			<Image h="50%" src={src} />
			<Heading>{title}</Heading>
			<Text>This is a mother fucken LIZARD BRO!!!!</Text>
			<Flex justifyContent={'center'} gap="1">
				<Button
					variant="solid"
					colorScheme={'cyan'}
					onClick={() => toast.success('yes!')}
				>
					yes
				</Button>
				<Button variant="solid" colorScheme={'cyan'}>
					no
				</Button>
			</Flex>
		</Box>
	);
}
