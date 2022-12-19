import axios from 'axios';
import { executeSignIn } from 'controllers/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Heading, Flex } from '@chakra-ui/react';
import { getCurrentUser } from 'controllers/auth';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { MdCheck } from 'react-icons/md';
import { BrandLogoWithName } from 'components/BrandLogo';
import { DesktopOnly, MobileOnly } from 'components/deviceTypes';
import { useChakraForm } from 'lib-client/useChakraForm';
import { z } from 'zod';
import { useLayoutStore } from 'stores/LayoutStore';

const schema = z.object({
  email: z.string().min(1, { message: 'Required' }),
  password: z.string().min(1, { message: 'Required' }),
});

interface IProps {}
export default function AuthPage(props: IProps) {
  const {} = props;
  const router = useRouter();

  // const {setActivePage } = useLayoutStore()
  // If user is already signed in then change route
  useEffect(() => {
    const user = getCurrentUser();
    if (user) router.replace('/');
  }, []);

  const {
    formState: { isSubmitting },
    Input,
    Form,
    DebugPanel,
  } = useChakraForm({ schema });

  const [isServerSuccess, setIsServerSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/auth', data);
      const userData = res.data;
      executeSignIn(userData);
      setIsServerSuccess(true);
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
          className="flex flex-col justify-center items-center w-full child:my-5 child:w-full child:max-w-[450px]"
          px={{ base: 3, sm: 6, lg: 8 }}
          id="login-form"
          submitLabel={isServerSuccess ? 'Success!' : 'Login'}
          submitBtnProps={{
            isLoading: isSubmitting,
            colorScheme: isServerSuccess ? 'green' : 'brand',
            loadingText: 'Submitting',
            leftIcon: isServerSuccess && <MdCheck fontSize="1.5rem" />,
          }}
        >
          <Input name="email" type="email" />
          <Input name="password" type="password" />
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
