import { Avatar, AvatarGroup, Box, Text, Divider, Flex, Tooltip } from '@chakra-ui/react';
import { FaClock } from 'react-icons/fa';
import moment from 'moment';
import { DraggableWrapper } from 'components/DragNDrop';
import { useTaskModal } from 'views/task/useTaskModal';
import { EditSubtasks } from 'views/task/EditSubtasks';
import { memo, useCallback } from 'react';
import { VscGrabber } from 'react-icons/vsc';
import { getObjectDifference } from 'utils/getObjectDifference';

const tagToColorMap = {
  design: 'cyan.500',
  develop: 'purple.300',
};

export const Task = memo(
  (props: any) => {
    const { task, index } = props;

    const { openTaskModal } = useTaskModal();

    const getTaskWithoutRelations = ({ assignees, ...task }) => ({ ...task });

    const taskContent = useCallback(
      ({ dragHandleProps }) => {
        return (
          <Box
            position="relative"
            transition="box-shadow 200ms"
            _hover={{
              boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px 0 rgba(0,0,0,0.08)',
            }}
            data-group
          >
            <Flex
              data-grab-handler
              alignItems={'center'}
              position="absolute"
              right="0"
              transition="right 200ms ease-in-out"
              h="100%"
              w="20px"
              _groupHover={{ right: '-5' }}
              zIndex={'1'}
              bgColor="gray.100"
              roundedRight="xl"
              {...dragHandleProps}
            >
              <VscGrabber />
            </Flex>

            <Box
              zIndex={2}
              bgColor="white"
              w="100%"
              h="100%"
              position="relative"
              px={2}
              py={2}
            >
              <Flex data-top-section flexDir="row-reverse" position="relative">
                <Flex
                  alignItems="flex-end"
                  justifyContent="flex-end"
                  flexDir={'column-reverse'}
                  py="1.5"
                  px="1"
                  w="40px"
                  gap={1}
                >
                  <Box>
                    <AvatarGroup size="xs" max={5} alignContent="left" gap="1">
                      {task?.assignees?.map((user) => {
                        return (
                          <Tooltip key={user.id} label={user.fullName}>
                            <Avatar
                              size="xs"
                              borderColor="grey.50"
                              name={user.fullName}
                            />
                          </Tooltip>
                        );
                      })}
                    </AvatarGroup>
                  </Box>

                  <Text
                    as={Flex}
                    alignItems="center"
                    fontSize="sm"
                    fontWeight="normal"
                    textColor="gray.600"
                    gap={1}
                  >
                    {moment(task.dueDate).format('DD/MM/YYYY')}
                    <FaClock display="inline" />
                  </Text>
                </Flex>

                <Flex flex={1} flexDir="column">
                  <Text
                    fontSize={'xl'}
                    textAlign="left"
                    textColor="gray.800"
                    fontWeight="semibold"
                    mb="1"
                    flex={1}
                    _hover={{ cursor: 'pointer' }}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      openTaskModal(task);
                    }}
                  >
                    {task.title}
                  </Text>

                  <Text fontSize="sm" fontWeight="normal" textColor="gray.600">
                    {task.description}
                  </Text>
                </Flex>
              </Flex>
              <Divider
                bgColor={'lightGray'}
                display={
                  task?.subTasks && task?.subTasks?.length > 0 ? 'inline-block' : 'none'
                }
                // opacity={task?.subTasks && task?.subTasks?.length > 0 ? 1 : 0}
                my="2"
              />
              <EditSubtasks task={task} />
            </Box>
          </Box>
        );
      },
      [task]
    );

    const WrappedTask = useCallback(() => {
      return (
        <DraggableWrapper
          id={JSON.stringify(getTaskWithoutRelations(task))}
          index={index}
          dragContainerProps={({ isDragging }) => ({
            sx: {
              borderWidth: '1px',
              borderColor: 'blackAlpha.200',
              shadow: 'sm',
              transition: 'box-shadow 1s',
              w: '100%',
              display: 'inline-block',
              // px: '2.5',
              // py: '2',
              positon: 'relative',
              userSelect: 'none',
              margin: `0 0 ${1}px 0`,
              // backgroundColor: 'white',
              boxShadow: isDragging ? '0px 0px 0px 1px #3182ce' : '0px 0px 0px 0px #FFF',
              zIndex: 2,
            },
          })}
        >
          {/* {taskContent} */}
          {({ dragHandleProps }) => {
            return (
              <Box
                position="relative"
                transition="box-shadow 200ms"
                _hover={{
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px 0 rgba(0,0,0,0.08)',
                }}
                data-group
              >
                <Flex
                  data-grab-handler
                  alignItems={'center'}
                  position="absolute"
                  right="0"
                  transition="right 200ms ease-in-out"
                  h="100%"
                  w="20px"
                  _groupHover={{ right: '-5' }}
                  zIndex={'1'}
                  bgColor="gray.100"
                  roundedRight="xl"
                  {...dragHandleProps}
                >
                  <VscGrabber />
                </Flex>

                <Box
                  zIndex={2}
                  bgColor="white"
                  w="100%"
                  h="100%"
                  position="relative"
                  px={2}
                  py={2}
                >
                  <Flex data-top-section flexDir="row-reverse" position="relative">
                    <Flex
                      alignItems="flex-end"
                      justifyContent="flex-end"
                      flexDir={'column-reverse'}
                      py="1.5"
                      px="1"
                      w="40px"
                      gap={1}
                    >
                      <Box>
                        <AvatarGroup size="xs" max={5} alignContent="left" gap="1">
                          {task?.assignees?.map((user) => {
                            return (
                              <Tooltip key={user.id} label={user.fullName}>
                                <Avatar
                                  size="xs"
                                  borderColor="grey.50"
                                  name={user.fullName}
                                />
                              </Tooltip>
                            );
                          })}
                        </AvatarGroup>
                      </Box>

                      <Text
                        as={Flex}
                        alignItems="center"
                        fontSize="sm"
                        fontWeight="normal"
                        textColor="gray.600"
                        gap={1}
                      >
                        {moment(task.dueDate).format('DD/MM/YYYY')}
                        <FaClock display="inline" />
                      </Text>
                    </Flex>

                    <Flex flex={1} flexDir="column">
                      <Text
                        fontSize={'xl'}
                        textAlign="left"
                        textColor="gray.800"
                        fontWeight="semibold"
                        mb="1"
                        flex={1}
                        _hover={{ cursor: 'pointer' }}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          openTaskModal(task);
                        }}
                      >
                        {task.title}
                      </Text>

                      <Text fontSize="sm" fontWeight="normal" textColor="gray.600">
                        {task.description}
                      </Text>
                    </Flex>
                  </Flex>
                  <Divider
                    bgColor={'lightGray'}
                    display={
                      task?.subTasks && task?.subTasks?.length > 0
                        ? 'inline-block'
                        : 'none'
                    }
                    // opacity={task?.subTasks && task?.subTasks?.length > 0 ? 1 : 0}
                    my="2"
                  />
                  <EditSubtasks task={task} />
                </Box>
              </Box>
            );
          }}
        </DraggableWrapper>
      );
    }, [task]);

    return <WrappedTask />;
  },
  // memoize the task component if the task is not changed
  (
    { task: { status, statusId, ...taskA } },
    { task: { status: _, statusId: __, ...taskB } }
  ) => {
    const isEqual = JSON.stringify(taskA) === JSON.stringify(taskB);
    // const diff = getObjectDifference(taskA, taskB);
    // console.log({ taskA, taskB, diff, isEqual });
    return isEqual;
  }
);
