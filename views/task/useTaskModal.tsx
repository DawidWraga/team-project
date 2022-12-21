import { ModalBody, ModalFooter, Textarea } from '@chakra-ui/react';
import { useChakraForm } from 'lib-client/useChakraForm';
import { TaskModel } from 'prisma/zod';
import { useModalStore } from 'stores/ModalStore';
import { z } from 'zod';

export const useTaskModal = () => {
  const { setContent } = useModalStore();

  const { Form, Input, Heading, SubmitBtn } = useChakraForm({
    schema: TaskModel.extend({ due_date: z.string() }),
  });

  return () =>
    setContent({
      title: <Heading>Create new task</Heading>,
      main: (
        <>
          <Form>
            <ModalBody className="inputStack">
              <Input name="title" />
              <Input name="description" customInput={() => <Textarea />} />
              <Input name="due_date" type="date" />
              <SubmitBtn w="100%" />
            </ModalBody>
            <ModalFooter></ModalFooter>
          </Form>
        </>
      ),
    });
};
