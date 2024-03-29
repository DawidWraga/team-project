import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  IconButton,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { ChakraForm } from 'lib-client/hooks/useChakraForm';
import { TaskModel } from 'prisma/zod';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { FormHeading } from 'components/FormHeading';
import { z } from 'zod';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { UserSelect, multiUserOptionsSchema } from 'components/UserSelect';
import { controller } from 'lib-client/controllers';
import { useCurrentProject } from 'lib-client/hooks/useCurrentProject';
import { Task } from '@prisma/client';
import { Controller } from 'react-hook-form';
import { MenuButton, Menu, MenuList, MenuItem } from '@chakra-ui/react';
import { AiFillDelete } from 'react-icons/ai';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { ControllerWrapper } from 'lib-client/controllers/ControllerWrapper';
import { formatStatusOption, optionSchema, StatusSelect } from 'views/task/StatusSelect';

const SubtaskSchema = z.object({
  description: z.string(),
  completed: z.boolean().optional(),
  id: z.number().optional(),
});

export const useTaskModal = () => {
  const { setContent, onClose } = useModalStore();

  const { mutateAsync: createTask } = controller.useMutation({
    model: 'task',
    query: 'upsert',
  });

  const { data: currentProject } = useCurrentProject();

  const openTaskModal = (task?: Partial<Task> & { id: number }) => {
    const menuIcon = (
      <Menu placement="left-start" offset={[0, 0]}>
        <MenuButton as="div">
          <IconButton
            aria-label="task options button"
            variant="ghost"
            icon={<BiDotsVerticalRounded />}
          />
        </MenuButton>
        <MenuList w="30px">
          <ControllerWrapper model="task" query="delete">
            {({ mutateAsync: deleteTask }) => (
              <MenuItem onClick={() => deleteTask({ id: task.id }).then(() => onClose())}>
                <AiFillDelete />
                <Text pl="4px">Delete</Text>
              </MenuItem>
            )}
          </ControllerWrapper>
        </MenuList>
      </Menu>
    );

    const isEditing = Boolean(task?.id);

    return (
      setContent &&
      setContent({
        header: (
          <>
            <Box
              sx={{
                position: 'absolute',
                right: 12,
                top: 3,
                _hover: { cursor: 'pointer' },
              }}
            >
              {menuIcon}
            </Box>
            <FormHeading onClick={() => console.log(task)}>
              {task?.id ? `Edit task` : 'Create new task'}
            </FormHeading>
          </>
        ),
        body: (
          <ChakraForm
            schema={TaskModel.pick({
              title: true,
              description: true,
              dueDate: true,
              manhours: true,
            }).extend({
              assignees: multiUserOptionsSchema,
              ...(isEditing && {
                status: optionSchema,
              }),
            })}
            defaultValues={{
              title: '',
              description: '',
              dueDate: new Date(),
              assignees: [{ label: 'John Smith', value: 5 }],
              manhours: 1,
              ...(isEditing && {
                status: formatStatusOption(currentProject.statuses[0]),
              }),
            }}
            updateValues={task}
            dynamicSchemaNamesToObj={{ subTasks: SubtaskSchema }}
            render={({
              Form,
              Input,
              SubmitBtn,
              DebugPanel,
              updateSchema,
              InputList,
              isEditing,
              control,
            }) => (
              <Form
                onSubmit={({ assignees, status, ...data }) => {
                  if (assignees?.length) {
                    data = {
                      ...data,
                      assignees: assignees?.map((d) => ({ id: d.value })),
                    } as any;
                  }

                  if (!isEditing) {
                    data = {
                      projectId: currentProject.id,
                      statusId: currentProject.statuses[0].id,
                      ...data,
                    } as any;
                  }

                  if (isEditing && status?.value) {
                    data = {
                      ...data,
                      ...(status.value && { statusId: status.value }),
                    } as any;
                  }

                  createTask(data);
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
                <Input name="manhours" type="number" />
                {isEditing && (
                  <Input
                    name="status"
                    customInput={(props) => {
                      return <StatusSelect {...props} />;
                    }}
                  />
                )}
                <InputList
                  name="subTasks"
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
                  inputs={({ completed, ...props }, { removeAll }) => {
                    return (
                      <Flex alignItems="center" gap="1">
                        <Controller
                          control={control}
                          name={completed || ''}
                          key={completed || ''}
                          defaultValue={false}
                          render={({ field: { onChange, value, ref } }) => (
                            <Checkbox
                              onChange={onChange}
                              ref={ref}
                              isChecked={value}
                              size="lg"
                            />
                          )}
                        />
                        <Input
                          name={props.description}
                          hideLabel={true}
                          placeholder="add subtask"
                        />
                        <IconButton
                          aria-label="remove subtask"
                          icon={<MinusIcon fontSize="sm" />}
                          size="sm"
                          onClick={removeAll}
                        />
                      </Flex>
                    );
                  }}
                />
                <Button
                  leftIcon={<AddIcon fontSize=".7rem" color="shade.main" opacity="80%" />}
                  onClick={() => {
                    updateSchema.addObj('subTasks', SubtaskSchema.omit({ id: true }));
                  }}
                  fontWeight={'light'}
                  fontSize="sm"
                >
                  Add Subtask
                </Button>
                <SubmitBtn label="Task" w="100%" />
              </Form>
            )}
          />
        ),
      })
    );
  };

  return { openTaskModal };
};
