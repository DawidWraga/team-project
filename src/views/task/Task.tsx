import { Box, Text, Flex } from '@chakra-ui/react';
import { FaClock } from 'react-icons/fa';
import moment from 'moment';
import { DraggableWrapper } from 'components/DragNDrop';
import { useTaskModal } from 'views/task/useTaskModal';
import { EditSubtasks } from 'views/task/EditSubtasks';
import { memo } from 'react';
import { VscGrabber } from 'react-icons/vsc';
import { CustomAvatarGroup } from 'components/CustomAvatarGroup';

// use memo to optimise performance (only re-render when certain props change)
export const Task = memo(
  (props: { task: any; index: number }) => {
    const { task, index } = props;

    const { openTaskModal } = useTaskModal();

    return (
      <DraggableWrapper
        // pass task id to draggable wrapper so that it can be used to update the task status onDragEnd
        id={task.id.toString()}
        index={index}
        key={task.id}
        dragContainerProps={({ isDragging }) => ({
          sx: {
            borderWidth: '1px',
            borderColor: 'blackAlpha.200',
            shadow: 'sm',
            transition: 'box-shadow 1s',
            w: '100%',
            display: 'inline-block',
            positon: 'relative',
            userSelect: 'none',
            margin: `0 0 ${1}px 0`,
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
                left="0"
                transition="left 200ms ease-in-out"
                h="100%"
                w="20px"
                _groupHover={{ left: '-3' }}
                zIndex={'1'}
                bgColor="gray.100"
                roundedLeft="lg"
                border="1px solid rgba(0,0,0,0.08)"
                // enables whole task card to be dragged by clicking this element (see DraggableWrapper component)
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
                <Flex data-top-section flexDir="row-reverse" position="relative" gap={1}>
                  <Flex
                    alignItems="flex-end"
                    justifyContent="flex-end"
                    flexDir={'column-reverse'}
                    py="1.5"
                    px="1"
                    w="40px"
                    gap={2}
                  >
                    <CustomAvatarGroup users={task.assignees} />

                    <Flex flex={1} gap={1}>
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
                  </Flex>

                  <Flex flex={1} flexDir="column">
                    <Text
                      fontSize={'1.11rem'}
                      textAlign="left"
                      textColor="gray.800"
                      fontWeight="semibold"
                      mb="1"
                      _hover={{ cursor: 'pointer' }}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        openTaskModal(task);
                      }}
                    >
                      {task.title}
                    </Text>

                    <Flex gap={1}>
                      <Flex
                        rounded="xl"
                        h="min"
                        minW="20px"
                        justifyContent={'center'}
                        bgColor={getManhourTagColor(task?.manhours)}
                        fontSize="0.7rem"
                        px={'3px'}
                        py="2px"
                      >
                        {task?.manhours}h
                      </Flex>

                      <Text fontSize="sm" fontWeight="normal" textColor="gray.600">
                        {task.description}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <EditSubtasks subTasks={task.subTasks} taskId={task.id} />
              </Box>
            </Box>
          );
        }}
      </DraggableWrapper>
    );
  },
  // memoize the task component if the task is not changed
  (
    { task: { status, statusId, ...taskA } },
    { task: { status: _, statusId: __, ...taskB } }
  ) => {
    // return true;
    const isEqual = JSON.stringify(taskA) === JSON.stringify(taskB);
    // const diff = getObjectDifference(taskA, taskB);
    // console.log({ taskA: taskA.subTasks, taskB: taskB.subTasks, diff, isEqual });
    return isEqual;
  }
);

Task.displayName = 'Task';

function getManhourTagColor(manhours: number) {
  if (manhours < 5) {
    return 'green.300';
  } else if (manhours < 10) {
    return 'yellow.200';
  } else {
    return 'red.200';
  }
}
