import { Container, ContainerProps } from '@chakra-ui/react';

export function PageWrapper(props: ContainerProps) {
	const { children } = props;

	return (
		<Container maxW="container.lg" my="8">
			{children}
		</Container>
	);
}
