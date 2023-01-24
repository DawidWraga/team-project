import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import pages from 'config/pages';
import { LAYOUT_DISABLED_ROUTES } from 'lib-client/constants';

const getParentRoute = (url) => {
  if (url === '/') return '/';
  return '/' + url.split('/')[1];
};

export const useSyncPageToRoute = () => {
  const router = useRouter();
  const { setActivePage, closeOptionBar, optionBarIsOpen } = useLayoutStore();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url.includes('?')) url = url.split('?')[0];
      if (LAYOUT_DISABLED_ROUTES.includes(url)) return;

      const parentRoute = getParentRoute(url);
      const currentPage = pages.find((page) => page.parentLink.route === parentRoute);

      const conditionallyCloseOptionBar = () => {
        if (currentPage?.parentLink.hasOptionBar) return;

        const subPages = [...(currentPage?.headerLinks || [])];

        const currentSubPage = subPages.find((page) =>
          url.includes(page.route.split('?')[0])
        );

        if (currentSubPage && currentSubPage.hasOptionBar) return;

        // console.log({ url });

        closeOptionBar();
      };

      setActivePage(currentPage);
      conditionallyCloseOptionBar();
    };

    handleRouteChange(router.asPath);

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);
};
