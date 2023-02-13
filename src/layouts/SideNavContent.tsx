import { Flex } from '@chakra-ui/react';
import { BrandLogoWithName } from 'components/BrandLogo';
import pages from 'config/pages';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
import { NavItem } from 'layouts/NavItem';
import { controller } from 'lib-client/controllers';
import { getDateParams } from 'utils/getDateParams';

const usePagesConfig = () => {
  const { data: projects } = controller.useQuery({
    model: 'project',
    query: 'findMany',
    prismaProps: {
      select: {
        title: true,
        id: true,
      },
    },
    cacheTime: 60 * 60 * 1000,
  });

  const projectsData =
    projects &&
    projects.map((p) => ({
      label: p.title,
      route: `/projects/${p.id}`,
      defaultHeaderLink: '/tasks?' + getDateParams(),
    }));

  const projectsPageIndex = pages.findIndex((p) => p.parentLink.route === '/projects');
  const newPages = [...pages];
  newPages.splice(projectsPageIndex, 1, {
    ...pages[projectsPageIndex],
    sideNavLinks: projectsData,
  });
  return newPages;
};

export default function SideNavContent(props) {
  const {} = props;

  const isHydrated = useIsHydrated();

  const pages = usePagesConfig();

  const relevantPages = pages.filter((page) => {
    // const role = getCurrentUser().role;
    const role = 'emp';
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
