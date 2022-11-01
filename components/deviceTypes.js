import { Box } from '@chakra-ui/react';

export function MobileOnly(props) {
	const { children, display } = props;

	return (
		<Box
			{...props}
			className={`${display ? display : 'inline-block'} lg:hidden`}
		>
			{children}
		</Box>
	);
}

export function DesktopOnly(props) {
	const { children, display } = props;

	// MUST USE lg: inside dispaly prop as tailwind dows not allow dynamic creation of classnames

	return (
		<Box
			{...props}
			display={{
				base: 'none',

				lg: display ? display : 'inline-block',
			}}
		>
			{children}
		</Box>
	);
}

export function ScreenDependent(props) {
	const { childBoth, Desktop, Mobile } = props;

	return (
		<>
			<MobileOnly>
				<Mobile>{childBoth && childBoth}</Mobile>
			</MobileOnly>
			<DesktopOnly>
				<Desktop>{childBoth && childBoth}</Desktop>
			</DesktopOnly>
		</>
	);
}
