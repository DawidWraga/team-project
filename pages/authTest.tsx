import { Box } from '@chakra-ui/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { MdLogin } from 'react-icons/md';
import { useChakraForm } from 'lib-client/useChakraForm';
import { executeSignIn } from 'controllers/auth';
import { z } from 'zod';


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
// created page for testing next-auth
//temporarily paused development to focus on core requirements (auth is less important to client)

interface IProps {}

const schema = z.object({
  email: z.string().min(1, { message: 'Required' }),
  password: z.string().min(1, { message: 'Required' }),
});

export default function AuthTestPage(props: IProps) {
  const {} = props;



  const { Input, Form, SubmitBtn, Heading } = useChakraForm({ schema });

  const onSubmit = async (data) => {
    const res = await axios.post('/api/auth', data);
    return res.data;
  };

  return (
    <Box>
      <Heading>Auth test</Heading>
      <Form
        onSubmit={onSubmit}
        // onServerSuccess={async (userData) => {
        //   executeSignIn(userData);
        //   await setTimeoutPromise(150);
        //   router.push('/dashboard');
        // }}
        // onServerError={() => {
        //   toast.error('Invalid credentials', { position: 'top-center' });
        // }}
        // serverErrorFeedbackType={null}
        gap="12"
        pb={{ base: '100px', lg: '50px' }}
      >
        <Input name="email" type="email" />
        <Input name="password" type="password" />
        <SubmitBtn leftIcon={<MdLogin />} fontSize="1.2rem">
          Sign in
        </SubmitBtn>
      </Form>
    </Box>
  );
}
