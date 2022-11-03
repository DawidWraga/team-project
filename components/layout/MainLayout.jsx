import { Box } from '@chakra-ui/react';
import PageNavBar from './PageNavBar';
import HeaderAndSideNav from './HeaderAndSideNav';
import { useGlobalContext } from 'contexts/GlobalContext';

export default function Layout(props) {
	const { children } = props;
	const { sideNavIsOpen } = useGlobalContext();

	return (
		<>
			<PageNavBar />

			<Box
				ml={{ lg: '60px' }}
				mb={{ base: '60px', lg: 0 }}
				// h="100vh"
				zIndex="40"
				bgColor="gray.200"
			>
				<HeaderAndSideNav />
				<Box
					ml={{
						base: 0,
						lg: sideNavIsOpen ? '180px' : '0px',
					}}
					transition="margin-left 150ms"
					mt="60px"
					overflowX="hidden"
					h={{ base: 'calc(100vh - 120px)', lg: 'calc(100vh - 60px)' }}
				>
					{children}
				</Box>
			</Box>
		</>
	);
}
