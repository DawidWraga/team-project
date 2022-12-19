import SideNav from './SideNav';
import Header from './Header';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import pages from 'config/pages';
import { useLayoutStore } from 'stores/LayoutStore';

export default function HeaderAndSideNav(props) {
  const {} = props;

  const router = useRouter();
  const { activePage, setActivePage } = useLayoutStore();

  useEffect(() => {
    const currentPage = pages.find((page) => {
      const activeParent =
        router.pathname === '/' ? '/' : '/' + router.pathname.split('/')[1];

      return activeParent === page.parentLink.route;
    });

    if (!activePage) return setActivePage(currentPage);

    if (activePage?.parentLink?.route !== currentPage?.parentLink?.route)
      setActivePage && setActivePage(currentPage);
  }, [router.pathname]);

  return (
    <>
      <SideNav />
      <Header />
    </>
  );
}
