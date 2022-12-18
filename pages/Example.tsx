import { Box } from '@chakra-ui/react';
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

  const { data, isLoading } = Example.findMany.use();
  const { mutate, ...createRest } = Example.create.use();

  const { Input, DebugPanel, Form } = useChakraForm({
    schema: ExampleModel.pick({ text: true }),
  });

  // const onSubmit = (data) => toast(JSON.stringify(data));

  return (
    <Box display="flex" flexDir="row">
      <Form
        onSubmit={mutate}
        submitBtnProps={{ isLoading: createRest.isLoading }}
        maxW="30vw"
      >
        <Input name="text" />
        {/* <Input name="firstName" />
        <Input name="lastName" />
        <Input
          name="notifications"
          customInput={({ field }) => {
            return <Switch {...field} />;
          }}
        /> */}
        <DebugPanel />
      </Form>
      <Box bgColor="pale.main" w="100%">
        {isLoading && 'loading'}
        {data && data.map((item) => <p key={item.id}>{JSON.stringify(item)}</p>)}
      </Box>
    </Box>
  );
}
