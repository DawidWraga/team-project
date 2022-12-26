import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';

// interface IRouteData {
//   label: string;
//   route: string;
//   defaultHeaderLink?: string;
// }

// interface IPage {
//   parentLink: IRouteData;
//   sideNavLinks?: IRouteData[];
//   headerLinks?: IRouteData[];
// }

export default function ProjectsPage(props) {
  const { projects } = props;
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
