export function MobileOnly(props) {
	const { children, display } = props;

	return (
		<div
			{...props}
			className={`${display ? display : 'inline-block'} lg:hidden`}
		>
			{children}
		</div>
	);
}

export function DesktopOnly(props) {
	const { children, display } = props;

	// MUST USE lg: inside dispaly prop as tailwind dows not allow dynamic creation of classnames

	return (
		<div
			{...props}
			className={`hidden ${display ? display : 'lg:inline-block'}`}
		>
			{children}
		</div>
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
