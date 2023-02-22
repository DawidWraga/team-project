import { useRouter } from 'next/router';
import { MdLogin } from 'react-icons/md';
import { BrandLogoWithName } from 'components/BrandLogo';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { z } from 'zod';
import ExternalFormWrapper from 'layouts/ExternalFormWrapper';
import { Box, Button, Checkbox, HStack } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { Loading } from '@saas-ui/react';
import { useSession } from 'next-auth/react';

const schema = z.object({
  email: z.string().min(1, { message: 'Required' }),
  password: z.string().min(1, { message: 'Required' }),
});

interface IProps {}
export default function AuthPage(props: IProps) {
  const {} = props;
  const router = useRouter();
  const { status } = useSession();

  const { Input, Form, SubmitBtn, Heading, setError, DebugPanel } = useChakraForm({
    schema,
  });

  //redirect users back to dashboard if they are already logged in
  // if (status === 'authenticated') {
  //   router.replace('/dashboard');
  //   return <Loading variant="fullscreen" />;
  // }

  const onSubmit = async (data: any) => {
    const redirectEmail = `${
      data.email === 'demo1@make-it-all.co.uk' ? '/docs' : '/dashboard'
    }`;


    
    console.log(redirectEmail);

    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl: redirectEmail,
      redirect: false,
    });

    if (res?.error) {
      let message = 'Something went wrong, please try again later.';
      if (res.error === 'CredentialsSignin')
        message = 'Invalid credentials, please try again.';

      setError('server' as any, {
        message,
      });

      throw new Error(message);
    } else {
      setTimeout(() => {
        router.replace(redirectEmail);
      }, 300);
    }
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

      <Heading
        fontWeight={600}
        display={{ base: 'none', lg: 'inline-block' }}
        onClick={() => {
          router.push('/dashboard');
        }}
      >
        Sign into Portal
      </Heading>
      <Form
        serverErrorFeedbackType={null}
        onSubmit={onSubmit}
        gap="12"
        pb={{ base: '150px', lg: '50px' }}
      >
        <Input name="email" type="email" />
        <Input name="password" type="password" />
        <HStack justify="space-between">
          <Checkbox defaultChecked>Remember me</Checkbox>
          <Button variant="link" colorScheme="blue" size="sm">
            Forgot password?
          </Button>
        </HStack>
        <SubmitBtn leftIcon={<MdLogin />} fontSize="1.2rem">
          Sign in
        </SubmitBtn>
        <DebugPanel />
      </Form>
    </ExternalFormWrapper>
  );
}
