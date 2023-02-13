import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { ProjectModel } from 'prisma/zod';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { FormHeading } from 'components/FormHeading';
import { z } from 'zod';
import { CustomEditable } from 'components/EditableInput';
import { Button, Divider, Flex, IconButton, Text } from '@chakra-ui/react';
import { UserSelect, multiUserOptionsSchema } from 'components/UserSelect';
import { getSchemaName } from 'lib-client/hooks/useDynamicSchema';
import { Project } from '@prisma/client';
import { MdSave } from 'react-icons/md';
import { getObjectDifference } from 'utils/getObjectDifference';
import { MinusIcon } from '@chakra-ui/icons';
import { controller } from 'lib-client/controllers';

interface IProps {
  onClose: () => void;
  defaultValues?: Record<any, any>;
}

const ProjectModalBody = ({ defaultValues, ...props }: IProps) => {
  const { mutateAsync: createProject } = controller.use({
    query: 'create',
    model: 'project',
  });
  const { mutateAsync: updateProject } = controller.use({
    query: 'update',
    model: 'project',
  });

  const isEditing = Boolean(defaultValues);

  const processedDefaults = isEditing && processDefaultValues(defaultValues);

  const { Form, Input, SubmitBtn, DebugPanel, InputList, updateSchema, getValues } =
    useChakraForm({
      schema: ProjectModel.pick({ title: true, dueDate: true }).extend({
        assignees: multiUserOptionsSchema,
        ...(isEditing
          ? {
              id: z.number(),
              ...Object.fromEntries(
                Object.keys(processedDefaults)
                  .filter((k) => k.includes('status'))
                  .map((k) => [k, z.string()])
              ),
            }
          : {
              'objectName=status&property=label&index=1': z.string(),
              'objectName=status&property=label&index=2': z.string(),
              'objectName=status&property=label&index=3': z.string(),
            }),
      }),
      defaultValues: isEditing
        ? processedDefaults
        : {
            title: 'title1',
            dueDate: new Date(),
            'objectName=status&property=label&index=1': 'todo',
            'objectName=status&property=label&index=2': 'in-progress',
            'objectName=status&property=label&index=3': 'done',
          },
      dynamicSchemaObjectNames: ['status'],
    });

  return (
    <Form
      onSubmit={({ status, assignees, ...data }: any) => {
        // if(isEditing && JSON.parse(processedDefaults) !== JSON)

        if (!isEditing) {
          return createProject({
            data: {
              ...data,
              statuses: {
                create: status,
              },
              assignees: {
                connect: assignees.map((d) => ({ id: d.value })),
              },
            },
          });
        }

        if (isEditing) {
          console.log('editing submit');
          const changesMade =
            isEditing && getObjectDifference(processedDefaults, getValues());
          if (Object.keys(changesMade).length < 1) return;

          console.log('changes made: ', changesMade);

          const { id } = data;
          const { title, dueDate, changedAssignees, changedStatuses } = changesMade;

          return updateProject({
            where: { id },
            data: {
              dueDate,
              title,
              ...(assignees.length && {
                assignees: {
                  // set: [],
                  connect: assignees.map((d) => ({ id: d.value })),
                },
              }),
              ...(status.length && {
                statuses: {
                  // set: [],
                  connect: status,
                },
              }),
            },
          });
        }
      }}
      // onServerSuccess={props.onClose}
    >
      <DebugPanel />
      <Input name="title" />
      <Input name="dueDate" type="date" />
      <Input
        name="assignees"
        formControlProps={{
          sx: {
            '& > label': {
              transition: 'all 200ms',
            },
            '&:not([data-floating-label]) > label': {
              top: '2px !important',
            },
          },
          className: isEditing && 'keep-floating-label',
        }}
        labelProps={{ sx: { position: 'relative', top: '2px !important' } }}
        customInput={(props) => {
          // console.log(props.field);
          return <UserSelect {...props} />;
        }}
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
                  <Flex alignItems="center" gap="1">
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
                    <IconButton
                      aria-label="remove subtask"
                      icon={<MinusIcon fontSize="sm" />}
                      size="sm"
                      onClick={() => {
                        updateSchema.remove(label);
                      }}
                    />
                    {/* <Button
                      position="absolute"
                      right="-50px"
                      bottom="0"
                      onClick={() => updateSchema.remove([label])}
                    >
                      del
                    </Button> */}
                  </Flex>
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

      <SubmitBtn leftIcon={isEditing && <MdSave />} w="100%">
        {isEditing ? 'Save Changes' : 'Create project'}
      </SubmitBtn>
    </Form>
  );
};

export const useProjectModal = () => {
  const { setContent, onClose } = useModalStore();

  const openProjectModal = (props: any) =>
    setContent &&
    setContent({
      header: (
        <FormHeading>
          {props.defaultValues
            ? `Edit ${props.defaultValues.title}`
            : 'Create new project'}
        </FormHeading>
      ),
      body: <ProjectModalBody onClose={onClose} {...props} />,
    });

  return { openProjectModal };
};

function processDefaultValues(d: any) {
  const data = {
    id: d.id,
    title: d.title,
    dueDate: new Date(d.dueDate),
    assignees:
      d.assignees &&
      d.assignees.map(({ id, fullName }) => ({
        value: id,
        label: fullName,
      })),
  };

  if (d.statuses)
    d.statuses.forEach((status) => {
      const schemaName = getSchemaName({
        index: status.id,
        objectName: 'status',
        property: 'label',
      });
      data[schemaName] = status.label;
    });

  return data;
}
