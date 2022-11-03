import { Flex, Icon, IconButton } from '@chakra-ui/react';
import { MdMenu, MdMenuOpen } from 'react-icons/md';
import { isMobile } from 'utils/checkScreenWidth';

export default function Header(props) {
	const { children, sideNavIsOpen, setSideNavIsOpen } = props;

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
				{children}
			</Flex>
		</>
	);
}
