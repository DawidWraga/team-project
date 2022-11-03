import { Flex, Heading, Icon, IconButton, Box, Text } from '@chakra-ui/react';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import { isMobile } from 'utils/checkScreenWidth';
import { MobileOnly } from '../deviceTypes';
import ProfileMenu from '../ProfileMenu';
import { useGlobalContext } from 'contexts/GlobalContext';
import { SpinnerIcon } from '@chakra-ui/icons';
import { lazy, Suspense } from 'react';

export default function Header(props) {
	const {} = props;
	const { activePage, sideNavIsOpen, setSideNavIsOpen } = useGlobalContext();

	function HeaderContent() {
		if (!activePage?.route) return <>no route</>;

		const DynamicComponent = lazy(() =>
			import(`components/layout/headerContent${activePage.route}`).catch(
				() => ({
					default: () => <></>,
				})
			)
		);

		return (
			<Suspense fallback={<SpinnerIcon />}>
				<DynamicComponent {...props} />
			</Suspense>
		);
	}

	return (
		<>
			<Flex
				w="100%"
				h="60px"
				bgColor="shade.light"
				position="fixed"
				top="0"
				ml={{ lg: sideNavIsOpen ? '180px' : '0' }}
				transition="all 150ms"
				alignItems="center"
				zIndex={'banner'}
			>
				<IconButton
					variant={'unstyled'}
					onClick={() => setSideNavIsOpen((prev) => !prev)}
				>
					<Icon
						as={sideNavIsOpen && !isMobile() ? MdMenuOpen : MdMenu}
						color="white"
						w={'100%'}
						fontSize="1.7rem"
					/>
				</IconButton>
				<Flex h="100%" alignItems="center" gap="5">
					<Heading
						mx={{ base: 'auto', lg: 5 }}
						fontSize="1.5rem"
						fontWeight="semibold"
						textColor={'shade.inv'}
					>
						{activePage?.label || 'page not found'}
					</Heading>
					<HeaderContent />
				</Flex>
				{/* {children} */}
				<MobileOnly position="absolute" right="3" top="4">
					<ProfileMenu offset={[10, 15]} />
				</MobileOnly>
			</Flex>
		</>
	);
}
