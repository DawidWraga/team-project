import { Box, Flex, Text } from '@chakra-ui/react';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { Example } from 'lib-client/controllers';
import { ExampleModel } from 'prisma/zod';
import { useLayoutStore } from 'lib-client/stores/LayoutStore';
import { breakpoints } from 'utils/breakpoints';
import { DateChangeBtns } from 'components/DateChangeBtns';

interface IProps {}

export default function ExamplePage(props: IProps) {
  const {} = props;

  const { useSetOptionBar } = useLayoutStore();

  useSetOptionBar(
    <>
      <DateChangeBtns />
    </>
  );

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
      {/* <Flex
        flexDir="row"
        w="100%"
        justifyContent={'stretch'}
        sx={{
          '& > *': {
            maxW: 'unset',
          },
        }}
      >
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
      </Flex> */}
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
