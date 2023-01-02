import { Flex, Text, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { isMobile } from 'utils/checkScreenWidth';
import { BrandLogoWithName } from 'components/BrandLogo';
import { useActiveSideNavLink } from 'utils/useActiveSideNavLink';
import pages from 'config/pages';
import { getCurrentUser } from 'lib-client/controllers/auth';
import { HiDocumentText } from 'react-icons/hi';
import { FaTasks } from 'react-icons/fa';
import { MdForum, MdPeopleAlt } from 'react-icons/md';
import { RiDashboardFill } from 'react-icons/ri';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
import { NavItem } from 'layouts/NavItem';

const routeToIconMap = {
  '/forums': MdForum,
  '/docs': HiDocumentText,
  '/projects': FaTasks,
  '/users': MdPeopleAlt,
  '/dashboard': RiDashboardFill,
};

export default function SideNavContent(props) {
  const {} = props;
  const router = useRouter();
  const { activePage, setSideNavIsOpen } = useLayoutStore();

  const isHydrated = useIsHydrated();

  const relevantPages = pages.filter((page) => {
    const role = getCurrentUser().role;
    const route = page.parentLink.route;

    if (role === 'emp' && route === '/users') return false;
    else return true;
  });

  if (!isHydrated) return <>not hydrated...</>;

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        w="100%"
        h="60px"
        bgColor="shade.main"
      >
        <BrandLogoWithName
          sx={{
            '& > svg': {
              // display: { base: '', lg: 'inline-block' },
              fontSize: '1.7rem',
            },
            '& > h2': { fontSize: '1.5rem', color: 'white' },
          }}
        />
      </Flex>
      <Flex flexDir="column" textColor="white">
        {relevantPages.map((page) => (
          <NavItem page={page} key={page.parentLink.route} />
        ))}
      </Flex>
    </>
  );
}
