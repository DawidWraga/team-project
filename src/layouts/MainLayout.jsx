import { Box } from '@chakra-ui/react';
import PageNavBar from './PageNavBar';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { useRouter } from 'next/router';
import SideNav from 'layouts/SideNav';
import Header from 'layouts/Header';
import { LAYOUT_DISABLED_ROUTES } from 'lib-client/constants';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
import { getLeftOffset } from 'lib-client/stores/LayoutStore';

export default function MainLayout(props) {
  const { children } = props;

  const { topOffset, bottomOffset, sideNavIsOpen } = useLayoutStore();

  const leftOffset = useIsHydrated() && getLeftOffset && getLeftOffset(sideNavIsOpen);

  const router = useRouter();

  // hide layout on specified pages
  if (LAYOUT_DISABLED_ROUTES.includes(router.pathname)) return <>{children}</>;

  return (
    <>
      {/* <PageNavBar /> */}
      {/* <UserModal /> */}

      <Box
        mb={bottomOffset}
        zIndex="40"
        bgColor="#FAF7F1"
        // w="100%"
        overflowX="hidden"
      >
        <SideNav />
        <Header />
        <Box
          ml={leftOffset}
          transition="all 250ms"
          mt={topOffset}
          // overflowX="auto"
          overflowX="hidden"
          h={{
            base: `calc(100vh - ${
              // slice to remove "px" from end
              +topOffset.base.slice(0, -2) + +bottomOffset.base.slice(0, -2)
            }px)`,
            lg: `calc(100vh - ${topOffset.base})`,
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
