import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Flex } from '@chakra-ui/react';
import { FormHeading } from 'components/FormHeading';
import { controller } from 'lib-client/controllers';
import { ChakraFormWrapper } from 'lib-client/hooks/useChakraForm';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { emailSchema } from 'pages/register';
import { z } from 'zod';

export function useInviteModal() {
  const { setContent, onClose } = useModalStore();

  const { mutateAsync: createInvitation } = controller.useMutation({
    model: 'invitations',
    query: 'create',
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
            {({ InputList, Input, Form, SubmitBtn, updateSchema, DebugPanel }) => {
              return (
                <Form>
                  <InputList
                    name="email"
                    inputs={({ label, ...rest }, { RemoveButton }) => {
                      console.log(rest);
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
