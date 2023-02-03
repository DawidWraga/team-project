import {
  Button,
  Checkbox,
  Divider,
  Flex,
  IconButton,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { projectController, taskController } from 'lib-client/controllers';
import { ChakraForm, ChakraFormWrapper } from 'lib-client/hooks/useChakraForm';
import { TaskModel } from 'prisma/zod';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { FormHeading } from 'components/FormHeading';
import { useUrlData } from 'lib-client/hooks/useUrlData';
import { z } from 'zod';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { UserSelect, multiUserOptionsSchema } from 'components/UserSelect';

const SubtaskSchema = z.object({
  description: z.string(),
});

export const useTaskModal = () => {
  const { setContent, onClose } = useModalStore();
  const { mutateAsync: createTask } = taskController.useMutation('create', {});
  const { projectId } = useUrlData<{ projectId: number }>('dynamicPath');
  const projectPrismaProps = {
    where: {
      id: projectId,
    },
    include: {
      statuses: true,
      assignees: true,
    },
  };

  const { data: currentProject } = projectController.useQuery('findUnique', {
    prismaProps: projectPrismaProps,
    enabled: Boolean(projectId),
    cacheTime: 60 * 60 * 1000,
  });
  const { mutateAsync: updateProject } = projectController.useMutation('update', {});

  const openTaskModal = () =>
    setContent &&
    setContent({
      header: <FormHeading>Create new task</FormHeading>,
      body: (
        <ChakraForm
          schema={TaskModel.pick({
            title: true,
            description: true,
            dueDate: true,
          }).extend({
            assignees: multiUserOptionsSchema,
          })}
          defaultValues={{
            title: 'title1',
            description: 'description1',
            dueDate: new Date(),
          }}
          dynamicSchemaObjectNames={['subTask']}
          render={({ Form, Input, SubmitBtn, DebugPanel, updateSchema, InputList }) => (
            <Form
              onSubmit={({ assignees, ...data }) => {
                const firstStatus = currentProject?.statuses[0].id;

                createTask({
                  projectId,
                  assignees: assignees.map((d) => ({ id: d.value })),
                  statusId: firstStatus,
                  ...data,
                } as any);
              }}
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
              <Input name="dueDate" type="date" />
              <Input
                name="assignees"
                customInput={(props) => {
                  return <UserSelect {...props} />;
                }}
              />

              <InputList
                name="subTask"
                ConditionalWrapper={({ children }) => (
                  <Flex flexDir="column" gap={1}>
                    <Flex alignItems="center" gap={2} mb={2}>
                      <Divider bgColor="shade.main" />
                      <Text fontSize="lg" fontWeight={'semibold'}>
                        Subtasks
                      </Text>
                      <Divider bgColor="shade.main" />
                    </Flex>
                    {children}
                  </Flex>
                )}
                inputs={({ description }) => {
                  return (
                    <Flex alignItems="center" gap="1">
                      <Input
                        name={description}
                        hideLabel={true}
                        placeholder="add subtask"
                      />
                      <IconButton
                        aria-label="remove subtask"
                        icon={<MinusIcon fontSize="sm" />}
                        size="sm"
                        onClick={() => {
                          updateSchema.remove(description);
                        }}
                      />
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
          )}
        />
      ),
    });
  return { openTaskModal };
};
