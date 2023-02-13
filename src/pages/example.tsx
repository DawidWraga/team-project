import { Flex } from '@chakra-ui/react';
import { controller } from 'lib-client/controllers';
import { useCurrentProject } from 'lib-client/hooks/useCurrentProject';

export default function ExamplePage() {
  // const { data: project } = controller.useQuery<any, any, any>({
  //   model: 'project',
  //   query: 'getCountByStatus' as any,
  //   prismaProps: { id: 1 },
  // });

  // const statusToCount: any = {};
  // project?.length &&
  //   project?.forEach((it) => {
  //     const label = it.status.label;

  //     statusToCount[label] ? (statusToCount[label] += 1) : (statusToCount[label] = 1);
  //   });

  const { data: project } = useCurrentProject();

  return <Flex>{project && JSON.stringify(project.assignees)}</Flex>;
}
