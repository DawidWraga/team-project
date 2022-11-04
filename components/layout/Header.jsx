import { Flex, Icon, IconButton } from '@chakra-ui/react';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import { isMobile } from 'utils/checkScreenWidth';
import { MobileOnly } from '../deviceTypes';
import ProfileMenu from '../ProfileMenu';
import { useGlobalContext } from 'contexts/GlobalContext';
import HeaderContent from './HeaderContent';

export default function Header(props) {
	const {} = props;
	const { activePage, sideNavIsOpen, setSideNavIsOpen } = useGlobalContext();

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
				<HeaderContent />
				<MobileOnly position="absolute" right="3" top="4">
					<ProfileMenu offset={[10, 15]} />
				</MobileOnly>
			</Flex>
		</>
	);
}

// function HeaderContent() {
// 	if (!activePage?.parentLink.route) return <>no route</>;

// 	const DynamicComponent = lazy(() =>
// 		import(`components/layout/headerContent${activePage.route}`).catch(
// 			() => ({
// 				default: () => <></>,
// 			})
// 		)
// 	);

// 	return (
// 		<Suspense fallback={<></>}>
// 			<DynamicComponent {...props} />
// 		</Suspense>
// 	);
// }
