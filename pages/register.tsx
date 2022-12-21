import axios from 'axios';
import { useRouter } from 'next/router';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { useChakraForm } from 'lib-client/useChakraForm';
import { z } from 'zod';
import ExternalFormWrapper from 'components/ExternalFormWrapper';

export default function RegisterPage(props) {
  const {} = props;
  const router = useRouter();

  const { Input, Form, SubmitBtn, trigger, DebugPanel, Heading } = useChakraForm({
    schema: z
      .object({
        fullName: z.string(),
        email: z
          .string()
          .email()
          .refine(
            (arg) => arg.includes('@make-it-all.co.uk'),
            'Only internal emails allowed'
          ),
        password: z
          .string()
          .optional()
          .superRefine((password, ctx) => {
            let fullMsg = 'Password must contain at least';
            const originalMsg = fullMsg;

            // loop through requirements & append error message to fullMsg message if not met
            [
              { regex: /^.{8,}$/, msg: '8 characters' },
              { regex: /[@$!%*?&]{1,}/, msg: 'one symbol' },
              { regex: /[a-z]{1,}/, msg: 'one lowercase letter' },
              { regex: /[A-Z]{1,}/, msg: 'one uppercase letter' },
              { regex: /[0-9]{1,}/, msg: 'one number' },
            ].forEach(({ regex, msg }) => {
              const result = z.string().regex(regex).safeParse(password);
              if (!result.success) fullMsg += ` ${msg},`;
            });

            // if any requirements are not met, set error
            if (fullMsg !== originalMsg) {
              ctx.addIssue({
                code: 'custom',
                message: fullMsg.replace(/\,(?=[^,]*$)/, '.'),
              });
            }
          }),
        confirmPassword: z.string().optional(),
      })
      .superRefine(({ password, confirmPassword }, ctx) => {
        // check if passwords match
        if (confirmPassword !== password) {
          ctx.addIssue({
            code: 'custom',
            path: ['confirmPassword'],
            message: 'The passwords did not match',
          });
        }
      }),
  });

  const onSubmit = async (data) => {
    await axios.post('/api/register', data);
    await setTimeoutPromise(1500);
    router.push('/auth');
    // } catch (e) {
    //   const errors = e.response.data;

    // if (errors.type === 'email') {
    // setError(errors.type, {
    //   type: 'server',
    // });
    // }
    // if (errors.password) {
    //   setError('password', {
    //     type: "server",
    //     message: 'Something went wrong with password',
    //   });
    // }

    // toast.error('Unable to create new user', { position: 'top-center' });
  };

  return (
    <ExternalFormWrapper>
      <Form onSubmit={onSubmit}>
        <Heading>Create new account</Heading>
        <Input name="fullName" />
        <Input name="email" />
        <Input
          name="password"
          type="password"
          inputProps={({ field }) => {
            return {
              onChange: (ev) => {
                field.onChange(ev);
                trigger('password');
                // trigger form validation to show unmet password requirements BEFORE submit to improve UX
              },
            };
          }}
        />
        <Input name="confirmPassword" type="password" />
        <SubmitBtn>Register</SubmitBtn>
      </Form>
    </ExternalFormWrapper>
  );
}
