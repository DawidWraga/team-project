import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Flex } from '@chakra-ui/react';
import { FormHeading } from 'components/FormHeading';
import { ChakraFormWrapper } from 'lib-client/hooks/useChakraForm';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { z } from 'zod';

export function useInviteModal() {
  const { setContent, onClose } = useModalStore();

  const openInviteModal = () => {
    return (
      setContent &&
      setContent({
        header: <FormHeading> Invite Team</FormHeading>,
        body: (
          <ChakraFormWrapper
            schema={z.object({
              email: z.object({ label: z.string().email() }),
            })}
            dynamicSchemaNamesToObj={{ email: z.object({ label: z.string().email() }) }}
          >
            {({ InputList, Input, Form, SubmitBtn, updateSchema, DebugPanel }) => {
              return (
                <Form>
                  <InputList
                    name="email"
                    inputs={({ label }) => {
                      return (
                        <Input
                          key={new Date().getMilliseconds()}
                          hideLabel={true}
                          placeholder="email"
                          name={label}
                        />
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
