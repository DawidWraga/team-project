import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Heading, Flex } from '@chakra-ui/react';
import { getCurrentUser } from 'controllers/auth';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { MdLogin } from 'react-icons/md';
import { BrandLogoWithName } from 'components/BrandLogo';
import { DesktopOnly, MobileOnly } from 'components/deviceTypes';
import { useChakraForm } from 'lib-client/useChakraForm';
import { z } from 'zod';

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

  const { Input, Form, DebugPanel, SubmitBtn } = useChakraForm({ schema });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/auth', data);
      const userData = res.data;
      await setTimeoutPromise(180);
      router.push('/dashboard');
    } catch (e) {
      toast.error('Invalid credentials', { position: 'top-center' });
    }
  };

  return (
    <Flex
      className="bg-pale-main w-screen h-screen grid"
      w="100vw"
      h="100vh"
      justifyContent={'center'}
    >
      <DebugPanel />
      <Flex
        as="main"
        className="bg-white justify-center  rounded-lg shadow-xl "
        h={{ base: '100vh' }}
        w="100vw"
        maxW={{ base: '100vw', md: '650px', lg: '750px' }}
        alignContent="center"
        alignItems="center"
        justifyItems={'center'}
        roundedRight={{ lg: '3xl' }}
        flexDir="column"
      >
        <DesktopOnly w="100%">
          <Heading size="lg" fontWeight={600} textAlign="center" mb="2">
            Sign into Portal
          </Heading>
        </DesktopOnly>
        <MobileOnly w="100%">
          <BrandLogoWithName />
        </MobileOnly>
        <Form
          onSubmit={onSubmit}
          width="100%"
          maxW="480px"
          gap="12"
          sx={{
            '& > *': { w: '100%' },
          }}
          px={{ base: 3, sm: 6, lg: 8 }}
        >
          <Input name="email" type="email" />
          <Input name="password" type="password" />
          <SubmitBtn leftIcon={<MdLogin />} fontSize="1.2rem">
            Sign in
          </SubmitBtn>
        </Form>
      </Flex>
      <DesktopOnly w="100%" h="100vh" display="flex" justifyContent="center">
        <BrandLogoWithName
          sx={{
            '& > svg': { fontSize: '7rem' },
            '& > h2': { fontSize: '4rem' },
          }}
        />
      </DesktopOnly>
    </Flex>
  );
}
