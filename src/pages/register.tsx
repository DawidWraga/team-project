import { useRouter } from 'next/router';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { z } from 'zod';
import ExternalFormWrapper from 'layouts/ExternalFormWrapper';
import { controller } from 'lib-client/controllers';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
import { Loader } from '@saas-ui/react';

export const emailSchema = z
  .string()
  .email()
  .refine((arg) => arg.includes('@make-it-all.co.uk'), 'Only internal emails allowed');

const createUserSchema = z
  .object({
    fullName: z.string().min(5),
    email: emailSchema,
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
            path: ['password'],
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
  });

export default function RegisterPage(props: any) {
  const {} = props;
  const router = useRouter();

  const isHydrated = useIsHydrated();

  const { mutateAsync: createUser } = controller.useMutation({
    model: 'user',
    query: 'create',
  });

  const { Input, Form, SubmitBtn, trigger, DebugPanel, Heading } = useChakraForm({
    schema: createUserSchema,
  });

  if (!isHydrated) return <Loader />;

  return (
    <ExternalFormWrapper>
      <Form
        onSubmit={({ confirmPassword, ...data }) => {
          return createUser({
            ...data,
            userIcon: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 1000)}`,
          });
        }}
        onServerSuccess={async () => {
          await setTimeoutPromise(1000);
          router.push('/auth');
        }}
      >
        <Heading>Create an account</Heading>
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
      <DebugPanel />
    </ExternalFormWrapper>
  );
}
