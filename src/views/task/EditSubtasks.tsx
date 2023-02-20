import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, Checkbox } from '@chakra-ui/react';
import { SubTask, Task } from '@prisma/client';
import { CustomEditable } from 'components/EditableInput';
import { useUpdateTask } from 'lib-client/hooks/useTasks';
import { memo, useEffect, useState } from 'react';
import { arrayIsEqual } from 'utils/arrayIsEqual';
import { Box, Tooltip } from '@chakra-ui/react';

interface IProps {
  subTasks?: Partial<SubTask[]>;
  taskId?: number;
}

function EditSubtasksUnwrapped(props: IProps) {
  const { subTasks: originalSubtasks, taskId } = props;
  const { mutateAsync: updateTask } = useUpdateTask();

  const [subTasks, setSubTasks] = useState<Partial<SubTask>[]>(originalSubtasks || []);

  // if the original subtasks change, update the local state
  useEffect(() => {
    setSubTasks(originalSubtasks || []);
  }, [originalSubtasks]);

  return (
    <>
      <TaskDivider subTasks={subTasks} />
      {subTasks?.length > 0 && (
        <Flex flexDir="column">
          {subTasks.map((subTask) => {
            return (
              <Flex key={JSON.stringify(subTask)} gap={1}>
                <Checkbox
                  isChecked={subTask.completed}
                  size="lg"
                  onChange={() => {
                    const newSubtasks = [...subTasks];
                    const index = newSubtasks.findIndex((s) => s.id === subTask.id);
                    newSubtasks[index].completed = !newSubtasks[index].completed;

                    updateTask({
                      id: taskId,
                      subTasks: newSubtasks,
                    });
                  }}
                />
                <CustomEditable
                  value={subTask.description}
                  type="text"
                  inputAndPreviewSx={{ py: 1, height: '35px' }}
                  onSubmit={(data) => {
                    const newSubtasks = [...subTasks];
                    const index = newSubtasks.findIndex((s) => s.id === subTask.id);
                    newSubtasks[index].description = data;

                    updateTask({
                      id: taskId,
                      subTasks: newSubtasks,
                    });
                  }}
                />
              </Flex>
            );
          })}
        </Flex>
      )}
      <Flex
        alignItems="center"
        gap="1"
        w="100%"
        h="8px"
        // bgColor="red"
        transition="all 0.2s"
        _hover={{
          h: '12px',
          '& > *': {
            opacity: 1,
          },
        }}
        justifyContent="center"
        sx={{ '& > *': { color: 'gray.700', opacity: 0, transition: 'all 200ms' } }}
      >
        <Button
          leftIcon={<AddIcon fontSize="xx-small" />}
          aria-label="new subtask"
          variant="unstyled"
          size="xs"
          onClick={() => {
            // console.log('clicked');
            setSubTasks((prev) => [...prev, { description: '', completed: false }]);
          }}
        >
          new subtask
        </Button>
      </Flex>
    </>
  );
}

// momoize the component to prevent rerenders
export const EditSubtasks = memo(EditSubtasksUnwrapped, (prev, curr) => {
  const equal = arrayIsEqual(prev.subTasks, curr.subTasks);
  return equal;
});

export function TaskDivider(props: { subTasks: any }) {
  if (!props?.subTasks || props?.subTasks?.length === 0) {
    return <></>;
  }
  const { subTasks } = props;

  // WIDTH VALUE CALCUALTIONS
  const subtaskCount = subTasks?.length;
  const completedSubtaskCount = subTasks?.filter(
    (subtask: any) => subtask.completed
  ).length;
  const incompleteSubtaskCount = subtaskCount - completedSubtaskCount;

  const widthValues = {
    complete: Math.floor((completedSubtaskCount / subtaskCount) * 100) + '%',
    incomplete: Math.floor((incompleteSubtaskCount / subtaskCount) * 100) + '%',
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
        label={`${incompleteSubtaskCount} subtask${
          incompleteSubtaskCount > 1 ? 's' : ''
        } remaining (${widthValues.incomplete})`}
      >
        <Box
          bgColor="green.500"
          opacity={0.8}
          w={widthValues.complete}
          h="100%"
          display="inline-block"
          rounded="2xl"
        />
      </Tooltip>
      <Tooltip
        label={`${completedSubtaskCount} subtask${
          completedSubtaskCount > 1 ? 's' : ''
        } completed (${widthValues.complete})`}
      >
        <Box
          bgColor="green.100"
          w={widthValues.incomplete}
          h="100%"
          display="inline-block"
          roundedRight={'2xl'}
        />
      </Tooltip>
    </Box>
  );
}
