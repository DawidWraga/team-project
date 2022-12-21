import { Box, Button, Flex, useModalContext } from '@chakra-ui/react';
import { useChakraForm } from 'lib-client/useChakraForm';
import { Example } from 'controllers';
import { ExampleModel } from 'prisma/zod';
import { useModalStore } from 'stores/ModalStore';

interface IProps {}

export const getServerSideProps = Example.findMany.prefetch;

export default function ExamplePage(props: IProps) {
  const {} = props;

  const { setContent } = useModalStore();

  const findMany = Example.findMany.use();
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
      <Flex
        flexDir="row"
        w="100%"
        justifyContent={'stretch'}
        sx={{
          '& > *': {
            maxW: 'unset',
          },
        }}
      >
        <Button
          onClick={() => {
            setContent({ title: 'test', main: 'hello' });
          }}
        />
        <CreateForm.Form
          onSubmit={create.mutateAsync}
          onServerSuccess={CreateForm.reset}
          serverErrorFeedbackType="toast"
        >
          <CreateForm.Heading>Create</CreateForm.Heading>
          <CreateForm.Input name="text" />
          <CreateForm.SubmitBtn />
        </CreateForm.Form>
        <DeleteForm.Form onSubmit={del.mutateAsync}>
          <DeleteForm.Heading>Delete</DeleteForm.Heading>
          <DeleteForm.Input type="number" name="id" />
          <DeleteForm.SubmitBtn />
        </DeleteForm.Form>
        <UpdateForm.Form onSubmit={update.mutateAsync}>
          <UpdateForm.Heading>Update</UpdateForm.Heading>
          <UpdateForm.Input name="text" />
          <UpdateForm.Input type="number" name="id" />
          <UpdateForm.SubmitBtn />
        </UpdateForm.Form>
      </Flex>
      <Box bgColor="pale.main">
        {findMany.isLoading && 'loading'}
        {findMany.data &&
          findMany.data.map((item) => <p key={item.id}>{JSON.stringify(item)}</p>)}
      </Box>
    </Flex>
  );
}
