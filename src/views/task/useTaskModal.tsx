import { Textarea } from '@chakra-ui/react';
import { taskController } from 'lib-client/controllers';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { TaskModel } from 'prisma/zod';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { FormHeading } from 'components/FormHeading';
import { useUrlData } from 'lib-client/hooks/useNextQueryParams';

interface IProps {
  onClose: () => void;
}

const TaskModalBody = (props: IProps) => {
  const { mutateAsync: createTask } = taskController.useMutation('create', {});
  const { projectId } = useUrlData<{ projectId: number }>('dynamicPath');

  const { Form, Input, SubmitBtn, DebugPanel } = useChakraForm({
    schema: TaskModel.pick({ title: true, description: true, dueDate: true }),
    defaultValues: {
      title: 'title1',
      description: 'description1',
      dueDate: new Date(),
    },
  });

  return (
    <Form
      onSubmit={(d) => createTask({ projectId, ...d })}
      onServerSuccess={props.onClose}
    >
      <DebugPanel />
      <Input name="title" />
      <Input
        name="description"
        customInput={({ field, defaults, fieldState }) => (
          <Textarea {...field} {...(defaults as any)} />
        )}
      />
      <Input name="dueDate" type="date" />
      <SubmitBtn w="100%">Create task</SubmitBtn>
    </Form>
  );
};

export const useTaskModal = () => {
  const { setContent, onClose } = useModalStore();

  const openTaskModal = () =>
    setContent &&
    setContent({
      header: <FormHeading>Create new task</FormHeading>,
      body: <TaskModalBody onClose={onClose} />,
    });
  return { openTaskModal };
};
