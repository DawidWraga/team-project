import { Textarea } from '@chakra-ui/react';
import { taskController } from 'lib-client/controllers';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { TaskModel } from 'prisma/zod';
import { useModalStore } from 'lib-client/stores/ModalStore';

export const useTaskModal = () => {
  const { setContent, onClose } = useModalStore();

  const { mutateAsync: createTask } = taskController.create.use();

  const { Form, Input, Heading, SubmitBtn, DebugPanel } = useChakraForm({
    schema: TaskModel.pick({ title: true, description: true, due_date: true }),
  });

  return () =>
    setContent &&
    setContent({
      header: <Heading>Create new task</Heading>,
      body: (
        <Form
          onSubmit={async ({ due_date, ...data }) =>
            createTask({ due_date: new Date(due_date), ...data })
          }
          onServerSuccess={onClose}
        >
          <DebugPanel />
          <Input name="title" />
          <Input
            name="description"
            customInput={({ field, defaults, fieldState }) => (
              <Textarea {...field} {...(defaults as any)} />
            )}
          />
          <Input name="due_date" type="date" />
          <SubmitBtn w="100%">Create task</SubmitBtn>
        </Form>
      ),
    });
};
