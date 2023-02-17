import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, Text, Checkbox } from '@chakra-ui/react';
import { SubTask, Task } from '@prisma/client';
import { CustomEditable } from 'components/EditableInput';
import { randomUUID } from 'crypto';
import { useUpdateTask } from 'lib-client/hooks/useTasks';
import { memo, useCallback, useEffect, useState } from 'react';
import { arrayIsEqual } from 'utils/arrayIsEqual';

interface IProps {
  task: Task & { subTasks?: SubTask[] };
}

function EditSubtasksUnwrapped(props: IProps) {
  const { task } = props;
  const { mutateAsync: updateTask } = useUpdateTask();

  const [subTasks, setSubTasks] = useState<Partial<SubTask>[]>(task?.subTasks || []);

  return (
    <>
      {subTasks?.length > 0 && (
        <Flex flexDir="column">
          {subTasks.map((subTask) => {
            return (
              <Flex
                key={subTask.id || new Date().getMilliseconds() + subTask.description}
                gap={1}
              >
                <Checkbox
                  isChecked={subTask.completed}
                  size="lg"
                  onChange={() => {
                    const newSubtasks = [...subTasks];
                    const index = newSubtasks.findIndex((s) => s.id === subTask.id);
                    newSubtasks[index].completed = !newSubtasks[index].completed;

                    updateTask({
                      id: task.id,
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
                      id: task.id,
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
            console.log('clicked');
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
  const equal = arrayIsEqual(prev.task.subTasks, curr.task.subTasks);
  // console.log('subtask memo', { equal });
  return equal;
});
