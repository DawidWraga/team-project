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
import { useFilteredTasks } from 'lib-client/hooks/useTasks';
import { Controller } from 'react-hook-form';
import { MenuButton, Menu, MenuList, MenuItem } from '@chakra-ui/react';
import { AiFillDelete } from 'react-icons/ai';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { ControllerWrapper } from 'lib-client/controllers/ControllerWrapper';

const SubtaskSchema = z.object({
  description: z.string(),
  completed: z.boolean().optional(),
  id: z.number().optional(),
});

export const useTaskModal = () => {
  const { setContent, onClose } = useModalStore();
  const { queryKey } = useFilteredTasks();

  const { mutateAsync: createTask } = controller.useMutation({
    model: 'task',
    query: 'upsert',
    // mode: 'optimistic',
    // changeUiKey: queryKey,
    // invalidateClientChanges: true,
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
            logDataBeforeSubmit={true}
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
              assignees: [{ label: 'Dawid Wraga', value: 5 }],
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
                onSubmit={({ assignees, ...data }) => {
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
                  inputs={({ completed, ...props }, removeAll) => {
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
