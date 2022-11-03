import { Box } from '@chakra-ui/react';
import PageIcons from './PageIcons';
import SideNav from './SideNav';
import Header from './Header';
import { useState } from 'react';
// import { useRouter } from 'next/router';
// import pages from 'db/pages.json';

export default function Layout(props) {
	const { page, SideNavContent, HeaderContent } = props;

	// const router = useRouter();
	// const pageData =
	// 	pages.find((page) => page.route === router.pathname) || 'home';

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
						{<SideNavContent /> || <>no side nav </>}
					</SideNav>
				}
				<Header
					sideNavIsOpen={sideNavIsOpen}
					setSideNavIsOpen={setSideNavIsOpen}
				>
					{<HeaderContent /> || <>no header content</>}
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
					{page}
				</Box>
			</Box>
			<PageIcons />
		</>
	);
}
