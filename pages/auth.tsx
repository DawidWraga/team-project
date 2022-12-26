import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCurrentUser } from 'lib-client/controllers/auth';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { MdLogin } from 'react-icons/md';
import { BrandLogoWithName } from 'components/BrandLogo';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { z } from 'zod';
import { executeSignIn } from 'lib-client/controllers/auth';
import ExternalFormWrapper from 'layouts/ExternalFormWrapper';
import { Box } from '@chakra-ui/react';

const schema = z.object({
  email: z.string().min(1, { message: 'Required' }),
  password: z.string().min(1, { message: 'Required' }),
});

interface IProps {}
export default function AuthPage(props: IProps) {
  const {} = props;
  const router = useRouter();

  // If user is already signed in then change route
  useEffect(() => {
    const user = getCurrentUser();
    if (user) router.replace('/');
  }, []);

  const { Input, Form, SubmitBtn, Heading } = useChakraForm({ schema });

  const onSubmit = async (data) => {
    return axios.post('/api/auth', data);
  };

  return (
    <ExternalFormWrapper>
      <Box w="100%" display={{ lg: 'none', base: 'inline-block' }}>
        <BrandLogoWithName
          headingSize={'2xl'}
          position="relative"
          right={3}
          bottom={'60px'}
        />
      </Box>

      <Heading fontWeight={600} display={{ base: 'none', lg: 'inline-block' }}>
        Sign into Portal
      </Heading>
      <Form
        onSubmit={onSubmit}
        onServerSuccess={async (userData) => {
          executeSignIn(userData);
          await setTimeoutPromise(150);
          router.push('/dashboard');
        }}
        onServerError={() => {
          toast.error('Invalid credentials', { position: 'top-center' });
        }}
        serverErrorFeedbackType={null}
        gap="12"
        pb={{ base: '150px', lg: '50px' }}
      >
        <Input name="email" type="email" />
        <Input name="password" type="password" />
        <SubmitBtn leftIcon={<MdLogin />} fontSize="1.2rem">
          Sign in
        </SubmitBtn>
      </Form>
    </ExternalFormWrapper>
  );
}
