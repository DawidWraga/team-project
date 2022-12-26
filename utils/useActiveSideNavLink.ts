import { useRouter } from 'next/router';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';

export function useActiveSideNavLink() {
  const router = useRouter();
  const { activePage } = useLayoutStore();
  const hasSideNav = activePage?.sideNavLinks && activePage?.sideNavLinks?.length;

  if (!hasSideNav) return { activeSideNavLink: false };

  const activeSideNavLink = activePage.sideNavLinks.find((link) => {
    return router.asPath.includes(link.route);
  });

  return { activeSideNavLink };
}
