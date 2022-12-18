import { Box, Flex, Text } from '@chakra-ui/react';
import { useChakraForm } from 'lib-client/useChakraForm';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Switch } from '@chakra-ui/react';
import { Example } from 'controllers';
import { ExampleModel } from 'prisma/zod';

interface IProps {}

// const schema = z.object({
//   username: z.string().min(5).max(25),
//   firstName: z.string(),
//   lastName: z.string(),
//   notifications: z.any().optional(),
// });

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
          onSubmit={create.mutate}
          submitBtnProps={{ isLoading: create.isLoading }}
        >
          <Text>Create</Text>
          <CreateForm.Input name="text" />
        </CreateForm.Form>
        <UpdateForm.Form
          onSubmit={update.mutate}
          submitBtnProps={{ isLoading: update.isLoading }}
        >
          <Text>Update</Text>
          <UpdateForm.Input name="text" />
          <UpdateForm.Input type="number" name="id" />
        </UpdateForm.Form>
        <DeleteForm.Form
          onSubmit={del.mutate}
          submitBtnProps={{ isLoading: del.isLoading }}
        >
          <Text>Delete</Text>
          <DeleteForm.Input type="number" name="id" />
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
    </Flex>
  );
}
