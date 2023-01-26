import { Button, Checkbox, Divider, Flex, Text, Textarea } from '@chakra-ui/react';
import { taskController } from 'lib-client/controllers';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { SubTaskModel, TaskModel } from 'prisma/zod';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { FormHeading } from 'components/FormHeading';
import { useUrlData } from 'lib-client/hooks/useNextQueryParams';
import { InputRow } from 'components/InputRow';
import { z } from 'zod';
import { AddIcon, PlusSquareIcon } from '@chakra-ui/icons';

interface IProps {
  onClose: () => void;
}

// const SubtaskSchema = SubTaskModel.pick({ description: true, completed: true });
const SubtaskSchema = z.object({
  description: z.string(),
  completed: z.boolean().optional(),
});

const TaskModalBody = (props: IProps) => {
  const { mutateAsync: createTask } = taskController.useMutation('create', {});
  const { projectId } = useUrlData<{ projectId: number }>('dynamicPath');

  const { Form, Input, SubmitBtn, DebugPanel, updateSchema, InputList, register } =
    useChakraForm({
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
      <Divider />

      <InputList
        name="subTask"
        inputs={({ description, completed }) => {
          return (
            <Flex>
              <Input name={description} label={'Subtask'} placeholder="add subtask" />
              <Checkbox size="lg" mx="2" {...register(completed)} />
            </Flex>
          );
        }}
      />
      <Button
        leftIcon={<AddIcon fontSize=".7rem" color="shade.main" opacity="80%" />}
        onClick={() => {
          updateSchema.addObj('subTask', SubtaskSchema);
        }}
        fontWeight={'light'}
        fontSize="sm"
      >
        Add Subtask
      </Button>

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
