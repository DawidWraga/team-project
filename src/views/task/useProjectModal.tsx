import { projectController } from 'lib-client/controllers';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { ProjectModel } from 'prisma/zod';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { FormHeading } from 'components/FormHeading';
import { z } from 'zod';
import { CustomEditable } from 'components/EditableInput';
import { Button, Divider, Flex, Text } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { keepFloatingLabelActive } from 'utils/keepFloatingLabelActive';

interface IProps {
  onClose: () => void;
}

const optionsSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const ProjectModalBody = (props: IProps) => {
  const { mutateAsync: createProject } = projectController.useMutation('create', {});

  const { Form, Input, SubmitBtn, DebugPanel, InputList, updateSchema } = useChakraForm({
    schema: ProjectModel.pick({ title: true, dueDate: true }).extend({
      'status_label-1': z.string(),
      'status_label-2': z.string(),
      'status_label-3': z.string(),
      assigneeIds: optionsSchema.array().min(1),
    }),
    defaultValues: {
      title: 'title1',
      dueDate: new Date(),
      'status_label-1': 'todo',
      'status_label-2': 'in-progress',
      'status_label-3': 'done',
    },
  });

  return (
    <Form onSubmit={createProject} onServerSuccess={props.onClose}>
      <DebugPanel />
      <Input name="title" />
      <Input name="dueDate" type="date" />
      <Input
        name="assigneeIds"
        label="assignees"
        formControlProps={{
          sx: {
            '& > label': {
              transition: 'all 200ms',
            },
            '&:not([data-floating-label]) > label': {
              top: '2px !important',
            },
          },
        }}
        type="userSelect"
        // labelProps={{ sx: { position: 'relative', top: '2px !important' } }}
        // customInput={({ field, defaults }) => {
        //   return (
        //     // <Select
        //     //   options={users}
        //     //   {...field}
        //     //   onBlur={(ev) => {
        //     //     const keepActive = (field.value as any).length > 0;
        //     //     keepFloatingLabelActive(ev.target, keepActive);
        //     //   }}
        //     //   isMulti
        //     //   chakraStyles={{
        //     //     container: (prev) => ({
        //     //       ...prev,
        //     //       shadow: defaults.shadow,
        //     //       borderColor: defaults.borderColor,
        //     //     }),
        //     //     inputContainer: (prev) => ({
        //     //       ...prev,
        //     //       // py: 2,
        //     //       h: '40px',
        //     //       alignItems: 'center',
        //     //       justiftContent: 'center',
        //     //     }),
        //     //   }}
        //     // />
        //     <UserSelect {...field} {...defaults} />
        //   );
        // }}
      />
      <Flex alignItems="center" gap={2}>
        <Divider bgColor="shade.main" />
        <Text fontSize="lg">Statuses</Text>
        <Divider bgColor="shade.main" />
      </Flex>
      <InputList
        name="status"
        inputs={({ label }) => {
          return (
            <Input
              name={label}
              hideLabel={true}
              customInput={({ defaults, field, fieldState }: any) => {
                return (
                  <>
                    <CustomEditable
                      editableProps={{
                        ...defaults,
                        ...field,
                        defaultValue: field.value || ' ',
                        placeholder: 'Add new status...',
                        rounded: 'md',
                        shadow: 'sm',
                        position: 'relative',
                      }}
                    />
                    <Button
                      position="absolute"
                      right="-50px"
                      bottom="0"
                      onClick={() => updateSchema.remove([label])}
                    >
                      del
                    </Button>
                  </>
                );
              }}
            />
          );
        }}
      />
      <Button
        onClick={() => {
          updateSchema.addObj('status', { label: z.string() });
        }}
      >
        Add status
      </Button>

      <SubmitBtn w="100%">Create project</SubmitBtn>
    </Form>
  );
};

export const useProjectModal = () => {
  const { setContent, onClose } = useModalStore();

  const openProjectModal = () =>
    setContent &&
    setContent({
      header: <FormHeading>Create new project</FormHeading>,
      body: <ProjectModalBody onClose={onClose} />,
    });

  return { openProjectModal };
};
