import { useRouter } from 'next/router';
import { useLayoutStore } from 'stores/LayoutStore';

export function useActiveSideNavLink() {
  const { activePage } = useLayoutStore();
  const hasSideNav = activePage?.sideNavLinks && activePage?.sideNavLinks?.length;

  if (!hasSideNav) return { activeSideNavLink: false };

  const router = useRouter();
  const activeSideNavLink = activePage.sideNavLinks.find((link) => {
    return router.asPath.includes(link.route);
  });

  return { activeSideNavLink };
}
