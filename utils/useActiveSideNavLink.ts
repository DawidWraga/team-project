import { useRouter } from 'next/router';
import { useGlobalContext } from 'contexts/GlobalContext';

export function useActiveSideNavLink() {
	const { activePage } = useGlobalContext();
	const hasSideNav =
		activePage?.sideNavLinks && activePage?.sideNavLinks?.length;

	if (!hasSideNav) return { activeSideNavLink: false };

	const router = useRouter();
	const activeSideNavLink = activePage.sideNavLinks.find((link) => {
		return router.asPath.includes(link.route);
	});

	return { activeSideNavLink };
}
