import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { exampleController } from 'lib-client/controllers';
import { ExampleModel } from 'prisma/zod';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { DateSelector } from 'components/DateSelector';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { toast } from 'react-toastify';

interface IProps {}

const useCreateExampleForm = () => {
  const { setContent, onClose } = useModalStore();

  const { mutateAsync: createExample } = exampleController.create.use({
    mode: 'optimistic',
  });
  const { Form, Heading, Input, SubmitBtn } = useChakraForm({
    schema: ExampleModel.pick({ text: true }),
  });

  return () =>
    setContent({
      header: <Heading>Create example form</Heading>,
      body: (
        <Form
          onSubmit={createExample}
          onServerSuccess={() => {
            onClose();
            toast.success('example created');
          }}
        >
          <Input name="text" />
          <SubmitBtn />
        </Form>
      ),
    });
};

export default function ExamplePage(props: IProps) {
  const {} = props;

  const { useSetOptionBar } = useLayoutStore();

  useSetOptionBar(
    <>
      <DateSelector />
    </>
  );

  const openCreateExampleForm = useCreateExampleForm();

  const findMany = exampleController.findMany.use();
  const update = exampleController.update.use({ mode: 'changeUi' });
  const updateSave = exampleController.update.use<true>({ mode: 'saveUiChanges' });

  const del = exampleController.delete.use({ mode: 'changeUi' });
  const delSave = exampleController.delete.use<true>({ mode: 'saveUiChanges' });
  // delSave.mutate
  // const delSave = del.useSave();

  // const delServer = exampleController.delete.use({ mode: 'server' });

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
        justifyContent={'center'}
        sx={{
          '& > *': {
            maxW: 'unset',
          },
        }}
      >
        <Box w="300px">
          <Button mx="auto" onClick={openCreateExampleForm}>
            open create form
          </Button>
        </Box>
        <DeleteForm.Form onSubmit={del.mutateAsync}>
          <DeleteForm.Heading>Delete</DeleteForm.Heading>
          <DeleteForm.Input type="number" name="id" />
          <DeleteForm.SubmitBtn />
          <Button
            onClick={() => {
              delSave.mutateAsync();
            }}
          >
            save
            {/* ({del.unsavedChangesCount}) */}
          </Button>
        </DeleteForm.Form>
        <UpdateForm.Form onSubmit={update.mutateAsync}>
          <UpdateForm.Heading>Update</UpdateForm.Heading>
          <UpdateForm.Input name="text" />
          <UpdateForm.Input type="number" name="id" />
          <UpdateForm.SubmitBtn />
          <Button
            onClick={() => {
              updateSave.mutateAsync();
            }}
          >
            save
          </Button>
        </UpdateForm.Form>
      </Flex>
      <Box bgColor="pale.main">
        {findMany.isLoading && 'loading'}
        {findMany.data &&
          findMany.data.map((item) => (
            <Text textAlign="center" fontSize="2rem" key={item.id}>
              id = {item.id}, text = {item.text}
            </Text>
          ))}
      </Box>
    </Flex>
  );
}
