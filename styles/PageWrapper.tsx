import { Container, ContainerProps } from '@chakra-ui/react';

interface IProps extends ContainerProps {
	w?: 'xl' | '2xl';
}

export function PageWrapper(props: IProps) {
	const { children, w } = props;

	return (
		<Container
			maxW={w ? 'unset' : 'container.lg'}
			{...props}
			my="8"
			w={(() => {
				if (w === 'xl') return 'clamp(325px,85vw,1300px)';
				if (w === '2xl') return 'clamp(325px,90vw,1600px)';

				return 'unset';
			})()}
		>
			{children}
		</Container>
	);
}
