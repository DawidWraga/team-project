import {
  Avatar,
  AvatarGroup,
  Box,
  Text,
  Divider,
  Flex,
  Tooltip,
  Tag,
} from '@chakra-ui/react';
import { FaClock } from 'react-icons/fa';
import moment from 'moment';
import { DraggableWrapper } from 'components/DragNDrop';
import { useTaskModal } from 'views/task/useTaskModal';
import { EditSubtasks } from 'views/task/EditSubtasks';
import { memo, useCallback, useMemo } from 'react';
import { VscGrabber } from 'react-icons/vsc';
import { getObjectDifference } from 'utils/getObjectDifference';
import { CustomAvatarGroup } from 'components/CustomAvatarGroup';
import { Persona } from '@saas-ui/react';
import { schemaObjectToSchemaNames } from 'lib-client/hooks/useDynamicSchema';

const tagToColorMap = {
  design: 'cyan.500',
  develop: 'purple.300',
};

export const Task = memo(
  (props: any) => {
    const { task, index } = props;

    const { openTaskModal } = useTaskModal();

    const getTaskWithoutRelations = ({ assignees, ...task }) => ({ ...task });

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
                      <CustomAvatarGroup users={task.assignees} />

                      <Flex flex={1} gap={1}>
                        <Flex
                          rounded="xl"
                          h="min"
                          minW="20px"
                          justifyContent={'center'}
                          bgColor={getManhourTagColor(task?.manhours)}
                          fontSize="xs"
                          p={0.5}
                        >
                          {task?.manhours}h
                        </Flex>
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

                      <Text fontSize="sm" fontWeight="normal" textColor="gray.600">
                        {task.description}
                      </Text>
                    </Flex>
                  </Flex>
                  <TaskDivider subTasks={task.subTasks} />
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

function getManhourTagColor(manhours: number) {
  if (manhours < 5) {
    return 'green.200';
  } else if (manhours < 10) {
    return 'yellow.200';
  } else {
    return 'red.200';
  }
}

function TaskDivider(props: { subTasks?: [] }) {
  if (!props?.subTasks || props?.subTasks?.length === 0) {
    return <></>;
  }
  const { subTasks } = props;

  const subtaskCount = subTasks?.length;
  const completedSubtaskCount = subTasks?.filter(
    (subtask: any) => subtask.completed
  ).length;
  const incompleteSubtaskCount = subtaskCount - completedSubtaskCount;

  const widthValues = {
    complete: (completedSubtaskCount / subtaskCount) * 100 + '%',
    incomplete: (incompleteSubtaskCount / subtaskCount) * 100 + '%',
  };

  return (
    <Box
      w="100%"
      h={2}
      mb={4}
      rounded="md"
      sx={{
        '& > *': {
          transition: 'all 200ms ease-in-out',
        },
      }}
    >
      <Tooltip
        label={`${completedSubtaskCount} subtask${
          completedSubtaskCount > 1 ? 's' : ''
        } remaining (${widthValues.complete})`}
      >
        <Box bgColor="success" w={widthValues.complete} h="100%" display="inline-block" />
      </Tooltip>
      <Tooltip
        label={`${incompleteSubtaskCount} subtask${
          incompleteSubtaskCount > 1 ? 's' : ''
        } completed (${widthValues.incomplete})`}
      >
        <Box
          bgColor="gray.300"
          w={widthValues.incomplete}
          h="100%"
          display="inline-block"
        />
      </Tooltip>
    </Box>
  );
}
