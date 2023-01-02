import { Flex, Spacer } from '@chakra-ui/react';
import { DesktopOnly } from 'components/deviceTypes';
// import PageNavItem from './PageNavItem';
import { BrandLogoIcon } from 'components/BrandLogo';
import pages from 'config/pages';
import { getCurrentUser } from 'lib-client/controllers/auth';
import dynamic from 'next/dynamic';
import type { NextPage } from 'next';
const PageNavItem = dynamic(() => import('layouts/PageNavItem'), {
  ssr: false,
});

export default function PageNavBar(props) {
  const {} = props;

  const relevantPages = pages.filter((page) => {
    const role = getCurrentUser().role;
    const route = page.parentLink.route;

    if (role === 'emp' && route === '/users') return false;
    else return true;
  });

  return (
    <Flex
      position="fixed"
      h={{ base: '60px', lg: '100%' }}
      w={{ base: '100vw', lg: '60px' }}
      justifyContent={{ base: 'stretch', lg: 'center' }}
      alignContent="center"
      alignItems="center"
      flexDir={{ base: 'row', lg: 'column' }}
      bgColor={'shade.main'}
      bottom={0}
      top={{ lg: 0 }}
      zIndex="banner"
      py={{ lg: 2 }}
    >
      <DesktopOnly mb="9px">
        <BrandLogoIcon fontSize="2.7rem" />
      </DesktopOnly>

      {relevantPages.map((page) => {
        return (
          <PageNavItem
            key={page.parentLink.route}
            route={page.parentLink.route}
            label={page.parentLink.label}
          />
        );
      })}
      <Spacer flexGrow={1} />
      {/* <DesktopOnly
				display={{ base: 'none', lg: 'inline-flex' }}
				mt="auto"
				flexDir="column"
				gap="2"
			>
				<ProfileMenu offset={[0, 10]} placement="right" />
			</DesktopOnly> */}
    </Flex>
  );
}
