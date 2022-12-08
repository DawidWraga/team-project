import { Box } from '@chakra-ui/react';
import { useChakraForm } from 'lib-client/useChakraForm';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Switch } from '@chakra-ui/react';

interface IProps {}

const schema = z.object({
  username: z.string().min(5).max(25),
  firstName: z.string(),
  lastName: z.string(),
  notifications: z.any().optional(),
});

export default function ExamplePage(props: IProps) {
  const {} = props;

  const { Input, DebugPanel, Form } = useChakraForm({ schema });

  // const onSubmit = (data) => toast(JSON.stringify(data));

  return (
    <>
      <Form
        onSubmit={(data) => {
          console.log(data);
        }}
      >
        <Input name="username" />
        <Input name="firstName" />
        <Input name="lastName" />
        <Input
          name="notifications"
          customInput={({ field }) => {
            return <Switch {...field} />;
          }}
        />
        <DebugPanel />
      </Form>
    </>
  );
}
