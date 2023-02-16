import { Checkbox, Flex } from '@chakra-ui/react';
import { SubTask, Task } from '@prisma/client';
import { CustomEditable } from 'components/EditableInput';
import { ControllerWrapper } from 'lib-client/controllers/ControllerWrapper';
import { useFilteredTasks } from 'pages/projects/[projectId]/tasks';

interface IProps {
  task: Task & { subTasks?: SubTask[] };
}

export function EditSubtasks(props: IProps) {
  const { task } = props;
  const { queryKey } = useFilteredTasks();

  return (
    task?.subTasks?.length > 0 && (
      <ControllerWrapper
        model="subTask"
        query="update"
        mode="optimistic"
        changeUiKey={queryKey}
        logConfig={true}
      >
        {({ mutateAsync: updateTask }) => {
          return (
            <Flex
              flexDir="column"
              // zIndex={10000}
            >
              {task.subTasks.map((subTask) => {
                return (
                  <Flex key={subTask.id} gap={1}>
                    <Checkbox isChecked={subTask.completed} size="lg" />
                    <CustomEditable
                      value={subTask.description}
                      type="text"
                      inputAndPreviewSx={{ py: 1, height: '35px' }}
                      onSubmit={(data) => {
                        console.log('onsubmit', data);
                        updateTask({
                          id: subTask.id,
                          description: data,
                        });
                      }}
                    />

                    {/* {subTask.description}
                    {subTask.completed ? 'done' : 'not'} */}
                  </Flex>
                );
              })}
            </Flex>
          );
        }}
      </ControllerWrapper>
    )
  );
}

// const { queryKey } = useFilteredTasks();
// const { mutateAsync: updateTask } = controller.use({
//   model: 'task',
//   query: 'update',
//   mode: 'optimistic',
//   changeUiKey: queryKey,
// });

// function updateThisTask(field: keyof Task) {
//   return (data: any) => {
//     updateTask({ id: task.id, [field]: data });
//   };
// }

// const TaskDetails = useCallback(() => {
//   return (
//     <div>
//       <CustomEditable
//         value={task.description}
//         onSubmit={updateThisTask('description')}
//         type="textarea"
//       />
//       <CustomEditable
//         value={moment(task.dueDate).format('YYYY-MM-DD')}
//         // value={task.dueDate}
//         // onSubmit={updateThisTask('dueDate')}
//         type="text"
//         inputProps={{ type: 'date' }}
//         // renderPreview={(v) => {
//         //   console.log('RENDERED PREVIEW ', v);
//         //   return 'testing';
//         // }}
//         previewValue={(v) => moment(v).format('DD-MM-YYYY')}
//       />
//       <UpdateUserForm
//         defaultUsers={task.assignees as any}
//         model="task"
//         updateId={task.id}
//         modelFieldName="assignees"

//         // saveChangesDependancies={[isOpen]}
//         // useMutationProps={{ changeUiKey: queryKey, invalidateClientChanges: true }}
//       />
//     </div>
//   );
// }, [task]);
