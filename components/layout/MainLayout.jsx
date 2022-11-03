import { Box } from '@chakra-ui/react';
import PageNavBar from './PageNavBar';
import SideNav from './SideNav';
import Header from './Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import pages from 'db/pages.json';
import { useGlobalContext } from 'contexts/GlobalContext';

export default function Layout(props) {
	const { children, SideNavContent, HeaderContent } = props;

	const router = useRouter();
	const { activePage, setActivePage } = useGlobalContext();

	// router.events.on('routeChangeComplete', () => {});

	useEffect(() => {
		const currentPage =
			pages.find((page) => page.route === router.pathname) || 'home';

		// console.log({ currentPage, activePage });

		if (!activePage) return setActivePage(currentPage);

		if (activePage.route !== currentPage.route) setActivePage(currentPage);

		// if (!currentPage || !activePage) setActivePage(currentPage);

		// if (currentPage.route !== activePage?.route) setActivePage(currentPage);
		console.count('changed global');
	}, [router.pathname]);

	const [sideNavIsOpen, setSideNavIsOpen] = useState(false);

	return (
		<>
			<Box
				ml={{ lg: '60px' }}
				mb={{ base: '60px', lg: 0 }}
				// h="100vh"
				zIndex="40"
				bgColor="gray.200"
			>
				{
					<SideNav
						sideNavIsOpen={sideNavIsOpen}
						setSideNavIsOpen={setSideNavIsOpen}
					>
						{/* {<SideNavContent /> || <>no side nav </>} */}
					</SideNav>
				}
				<Header
					sideNavIsOpen={sideNavIsOpen}
					setSideNavIsOpen={setSideNavIsOpen}
				>
					{/* {<HeaderContent /> || <>no header content</>} */}
				</Header>
				<Box
					ml={{
						base: 0,
						lg: sideNavIsOpen ? '180px' : '0px',
					}}
					transition="margin-left 150ms"
					mt="60px"
					h="calc(100vh - 60px)"
				>
					{children}
				</Box>
			</Box>
			<PageNavBar />
		</>
	);
}
