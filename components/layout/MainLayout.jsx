import { Box } from '@chakra-ui/react';
import PageNavBar from './PageNavBar';
import HeaderAndSideNav from './HeaderAndSideNav';
import { useGlobalContext } from 'contexts/GlobalContext';
import { useRouter } from 'next/router';
import UserModal from 'components/UserModal';

export default function Layout(props) {
	const { children } = props;
	const { sideNavIsOpen } = useGlobalContext();
	const router = useRouter();

	// hide layout on specified pages
	if (['/auth', '/register'].includes(router.pathname)) return <>{children}</>;

	return (
		<>
			<PageNavBar />
			{/* <UserModal /> */}

			<Box
				ml={{ lg: '60px' }}
				mb={{ base: '60px', lg: 0 }}
				// h="100vh"
				zIndex="40"
				bgColor="blackAlpha.300"
			>
				<HeaderAndSideNav />
				<Box
					ml={{
						base: 0,
						lg: sideNavIsOpen ? '200px' : '0px',
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
