import { Box, useStyleConfig, FlexProps } from '@chakra-ui/react';

interface IProps extends FlexProps {
	variant: 'smooth' | 'elevated';
}

export function Paper(props: IProps) {
	const { variant, ...rest } = props;

	const styles = useStyleConfig('Paper', { variant });

	// Pass the computed styles into the `__css` prop
	return <Box __css={styles} {...rest} />;
}
