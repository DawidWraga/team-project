import { Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import { isMobile } from 'utils/checkScreenWidth';
import { MobileOnly } from '../deviceTypes';
import ProfileMenu from '../ProfileMenu';
import { useGlobalContext } from 'contexts/GlobalContext';
import { SpinnerIcon } from '@chakra-ui/icons';

export default function Header(props) {
	const { children, sideNavIsOpen, setSideNavIsOpen } = props;
	const { activePage } = useGlobalContext();

	function HeaderContent() {
		if (!activePage) return <SpinnerIcon />;

		return (
			<Heading
				mx={{ base: 'auto', lg: 5 }}
				fontSize="1.5rem"
				fontWeight="semibold"
				textColor={'shade.inv'}
			>
				{activePage.label}
			</Heading>
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
				{activePage && <HeaderContent />}
				{children}
				<MobileOnly position="absolute" right="3" top="4">
					<ProfileMenu offset={[10, 15]} />
				</MobileOnly>
			</Flex>
		</>
	);
}
