import SideNav from './SideNav';
import Header from './Header';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import pages from 'db/pages.json';
import { useGlobalContext } from 'contexts/GlobalContext';

export default function HeaderAndSideNav(props) {
	const {} = props;

	const router = useRouter();
	const { activePage, setActivePage } = useGlobalContext();

	useEffect(() => {
		const currentPage =
			pages.find((page) =>
				router.pathname.split('/')[1].includes(page.route.slice(1))
			) || 'home';

		// remove || home as this is not an object

		if (!activePage) return setActivePage(currentPage);

		if (activePage.route !== currentPage.route) setActivePage(currentPage);

		console.count('changed global');
	}, [router.pathname]);

	return (
		<>
			<SideNav />
			<Header />
		</>
	);
}
