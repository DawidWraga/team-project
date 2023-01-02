import { Center, Spinner } from '@chakra-ui/react';

interface IProps {}

export default function Loading(props: IProps) {
	const {} = props;

	return (
		<Center w="100vw" h="100vh" position="fixed" top="0" left="0">
			<Spinner color="brand.main" size="xl" />
		</Center>
	);
}
