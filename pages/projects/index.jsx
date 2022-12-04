import { Flex } from '@chakra-ui/react';
import query from 'controllers/query';
import { useRouter } from 'next/router';

// export const getServerSideProps = async (ctx) => {
// 	const projects = await query('projects');
// 	return {
// 		props: { projects },
// 	};
// };



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
