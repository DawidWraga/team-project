import { Box, Icon } from '@chakra-ui/react';
import { useGlobalContext } from 'contexts/GlobalContext';
import { MdClose } from 'react-icons/md';

export default function SideNav(props) {
	const { children, sideNavIsOpen, setSideNavIsOpen } = props;

	const { activePage } = useGlobalContext();

	return (
		<>
			<Box
				h="100vh"
				w={{ base: 'clamp(250px,70vw,350px)', lg: '180px' }}
				position="fixed"
				bgColor="shade.light"
				left={{
					base: sideNavIsOpen ? '0' : '-350px',
					lg: sideNavIsOpen ? '60px' : '-180px',
				}}
				top="0"
				zIndex="100"
				className="dingbop"
				transition="all 150ms"
				sx={{ '& > .chakra-text, & > p': { textColor: 'shade.inv' } }}
			>
				<Icon
					position="absolute"
					right="2"
					top="2"
					zIndex="50"
					display={{ base: 'inline-box', lg: 'none' }}
					onClick={() => setSideNavIsOpen(false)}
					_hover={{ cursor: 'pointer' }}
					as={MdClose}
					fontSize={'1.5rem'}
					color="gray.100"
				/>
				{activePage?.label}
				{children}
			</Box>
		</>
	);
}
