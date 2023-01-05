import axios from 'axios';
import { useRouter } from 'next/router';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { z } from 'zod';
import ExternalFormWrapper from 'layouts/ExternalFormWrapper';
import { userController } from 'lib-client/controllers';

const defaultUserIcon =
  'https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-user-avatar-login-interface-abstract-blue-icon-png-image_3917504.jpg';

const createUserSchema = z
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
  });

export default function RegisterPage(props) {
  const {} = props;
  const router = useRouter();

  const { mutateAsync: createUser } = userController.create.use();

  const { Input, Form, SubmitBtn, trigger, DebugPanel, Heading } = useChakraForm({
    schema: createUserSchema,
  });

  return (
    <ExternalFormWrapper>
      <Form
        onSubmit={async ({ confirmPassword, ...data }) => {
          return createUser({
            ...data,
            userIcon: defaultUserIcon,
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
    </ExternalFormWrapper>
  );
}