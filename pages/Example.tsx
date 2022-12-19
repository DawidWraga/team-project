import { Box, Flex, Text } from '@chakra-ui/react';
import { useChakraForm } from 'lib-client/useChakraForm';
import { Example } from 'controllers';
import { ExampleModel } from 'prisma/zod';

interface IProps {}

export const getServerSideProps = Example.findMany.prefetch;

export default function ExamplePage(props: IProps) {
  const {} = props;

  const findMany = Example.findMany.use();
  const findUnique = Example.findUnique.use({
    prismaProps: { id: 54 },
  });
  const create = Example.create.use();
  const update = Example.update.use();
  const del = Example.delete.use();

  const CreateForm = useChakraForm({
    schema: ExampleModel.pick({ text: true }),
  });
  const UpdateForm = useChakraForm({
    schema: ExampleModel.pick({ text: true, id: true }),
  });
  const DeleteForm = useChakraForm({
    schema: ExampleModel.pick({ id: true }),
  });

  return (
    <Flex flexDir="column">
      <Flex flexDir="row">
        <CreateForm.Form
          onSubmit={create.mutateAsync}
          onServerSuccess={CreateForm.reset}
          serverErrorFeedbackType="toast"
        >
          <Text>Create</Text>
          <CreateForm.Input name="text" />
          <CreateForm.SubmitBtn />
        </CreateForm.Form>
        <UpdateForm.Form onSubmit={update.mutateAsync}>
          <Text>Update</Text>
          <UpdateForm.Input name="text" />
          <UpdateForm.Input type="number" name="id" />
          <UpdateForm.SubmitBtn />
        </UpdateForm.Form>
        <DeleteForm.Form onSubmit={del.mutateAsync}>
          <Text>Delete</Text>
          <DeleteForm.Input type="number" name="id" />
          <DeleteForm.SubmitBtn />
        </DeleteForm.Form>
        <Box>
          item 52 = <br />
          {findUnique.data && JSON.stringify(findUnique.data)}
        </Box>
      </Flex>
      <Box bgColor="pale.main" w="100%">
        {findMany.isLoading && 'loading'}
        {findMany.data &&
          findMany.data.map((item) => <p key={item.id}>{JSON.stringify(item)}</p>)}
      </Box>
      <DeleteForm.DebugPanel />
    </Flex>
  );
}
