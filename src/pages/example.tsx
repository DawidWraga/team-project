import { Flex } from '@chakra-ui/react';
import { Loading } from '@saas-ui/react';
import { controller } from 'lib-client/controllers/Controller';

interface IProps {}

export default function ExamplePage(props: IProps) {
  const {} = props;

  const { data, isLoading } = controller.useQuery({
    model: 'project',
    query: 'findMany',
    prismaProps: { include: { tasks: true } },
  });

  return (
    <Flex flexDir="column">
      {isLoading && <Loading />}
      {data &&
        data.length &&
        data.map((example) => {
          return (
            <div>
              <h2>{example.title}</h2>
              {JSON.stringify(example.tasks)}
            </div>
          );
        })}
    </Flex>
  );
}
