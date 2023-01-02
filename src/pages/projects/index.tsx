import { Flex } from '@chakra-ui/react';
import { IPage, IRouteData } from 'config/pages';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const projectSideNavLinks: IRouteData[] = require('db/projects.json').map((project) => {
  return {
    label: project.title,
    route: `/projects/${project.id}`,
    defaultHeaderLink: '/dashboard',
  };
});
const pageConfig: IPage = {
  parentLink: {
    label: 'Projects',
    route: '/projects',
  },
  headerLinks: [
    {
      label: 'dashboard',
      route: '/dashboard',
    },
    {
      label: 'tasks',
      route: '/tasks',
    },
  ],
  sideNavLinks: projectSideNavLinks,
};

export default function ProjectsPage(props) {
  const { projects } = props;

  const { setActivePage } = useLayoutStore();

  useEffect(() => {
    console.log(pageConfig);
    setActivePage(pageConfig);
  }, []);

  return <></>;

  const router = useRouter();

  return (
    <Flex w="100%" h="100%" alignItems={'center'} flexDir="column" p="10" gap="3">
      {projects.map((project) => {
        return (
          <Flex
            key={project.id}
            bgColor="white"
            h="90px"
            w="clamp(300px,50vw,600px)"
            onClick={() => router.push(`/projects/${project.id}/dashboard`)}
          >
            {project.title}
          </Flex>
        );
      })}

      {/* projectS LIST page content here {JSON.stringify(projects)} */}
    </Flex>
  );
}
