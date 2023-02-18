import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react';
import { FormHeading } from 'components/FormHeading';
import { controller } from 'lib-client/controllers';
import { ChakraFormWrapper } from 'lib-client/hooks/useChakraForm';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { emailSchema } from 'pages/register';
import { MdOutlineContentCopy } from 'react-icons/md';
import { toast } from 'react-toastify';
import { z } from 'zod';

const url = 'https://www.localhost:3000/register';

export function useInviteModal() {
  const { setContent, onClose } = useModalStore();

  const { mutateAsync: createInvitation } = controller.useMutation({
    model: 'invitation',
    query: 'createMany',
  });

  const openInviteModal = () => {
    return (
      setContent &&
      setContent({
        header: <FormHeading> Invite Team</FormHeading>,
        body: (
          <ChakraFormWrapper
            schema={z.object({
              'objectName=email&property=label&index=0': emailSchema,
            })}
            dynamicSchemaNamesToObj={{ email: z.object({ label: emailSchema }) }}
            reValidateMode="onSubmit"
          >
            {({
              InputList,
              Input,
              Form,
              SubmitBtn,
              updateSchema,
              DebugPanel,
              isServerSuccess,
            }) => {
              return (
                <Form
                  onSubmit={(data: any) => {
                    const emails = data.email.map((d) => ({
                      email: d.label,
                    }));
                    return createInvitation({ data: emails });
                  }}
                >
                  <InputList
                    name="email"
                    inputs={({ label }, { RemoveButton }) => {
                      return (
                        <Flex gap={1}>
                          <Input hideLabel={true} placeholder="email" name={label} />
                          <RemoveButton />
                        </Flex>
                      );
                    }}
                  />
                  <Flex flexDir="column">
                    <Button
                      leftIcon={
                        <AddIcon fontSize=".7rem" color="shade.main" opacity="80%" />
                      }
                      onClick={() => {
                        updateSchema.addObj('email');
                      }}
                      fontWeight={'light'}
                      fontSize="sm"
                    >
                      Add another email
                    </Button>
                    <SubmitBtn>Invite</SubmitBtn>
                  </Flex>

                  {isServerSuccess && <SuccessMessage />}
                  <DebugPanel />
                </Form>
              );
            }}
          </ChakraFormWrapper>
        ),
      })
    );
  };

  return { openInviteModal, onClose };
}

function SuccessMessage() {
  const { onCopy, hasCopied } = useClipboard(url);

  return (
    <Flex flexDir="column" gap={1} justifyContent="center" textAlign={'center'}>
      <Text>Your colleagues can now join the platform</Text>
      <Text>Please send them this link to register</Text>
      <Flex
        justifyContent={'center'}
        gap={2}
        onClick={() => {
          onCopy();
          toast.success('Copied to clipboard');
        }}
      >
        <Flex border="1px solid lightGray" alignItems="center" justifyContent={'center'}>
          <Text fontFamily={'monospace'} verticalAlign="center" px={2.5}>
            {url}
          </Text>
        </Flex>

        <Tooltip label={hasCopied ? 'Copied!' : 'Copy to clipboard'}>
          <IconButton
            aria-label="copy register URL to clipboard"
            icon={<MdOutlineContentCopy />}
          />
        </Tooltip>
      </Flex>
      <Text color="error">Invitation will expire in 24 hours</Text>
    </Flex>
  );
}
