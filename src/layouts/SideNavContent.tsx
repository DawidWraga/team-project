import { Flex } from '@chakra-ui/react';
import { BrandLogoWithName } from 'components/BrandLogo';
import pages from 'config/pages';
import { getCurrentUser } from 'lib-client/controllers/auth';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
import { NavItem } from 'layouts/NavItem';


export default function SideNavContent(props) {
  const {} = props;

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
              fontSize: '2rem',
            },
            '& > h2': { fontSize: '1.6rem', color: 'white', pl: 4 },
            position: 'relative',
            right: '17px',
          }}
        />
      </Flex>
      <Flex flexDir="column" textColor="whiteAlpha.900" overflowY={'auto'}>
        {relevantPages.map((page) => (
          <NavItem page={page} key={page.parentLink.route} />
        ))}
      </Flex>
    </>
  );
}
