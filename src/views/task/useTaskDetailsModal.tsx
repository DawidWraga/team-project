import { useModalStore } from 'lib-client/stores/ModalStore';
import { z } from 'zod';
import { controller } from 'lib-client/controllers';
import { CompleteTask } from 'prisma/zod';
import { CustomEditable } from 'components/EditableInput';
import { Task } from '@prisma/client';
import { useCallback } from 'react';
import { UserSelect, UpdateUserForm } from 'components/UserSelect';
import moment from 'moment';
import { useFilteredTasks } from 'lib-client/hooks/useTasks';

export const useTaskDetailsModal = (task: CompleteTask) => {
  const { setContent, onClose, isOpen } = useModalStore();
  const { queryKey } = useFilteredTasks();
  const { mutateAsync: updateTask } = controller.use({
    model: 'task',
    query: 'update',
    mode: 'optimistic',
    changeUiKey: queryKey,
  });

  function updateThisTask(field: keyof Task) {
    return (data: any) => {
      updateTask({ id: task.id, [field]: data });
    };
  }

  const TaskDetails = useCallback(() => {
    return (
      <div>
        <CustomEditable
          value={task.description}
          onSubmit={updateThisTask('description')}
          type="textarea"
        />
        {/* <CustomEditable
          value={moment(task.dueDate).format('YYYY-MM-DD')}
          // value={task.dueDate}
          // onSubmit={updateThisTask('dueDate')}
          type="text"
          inputProps={{ type: 'date' }}
          // renderPreview={(v) => {
          //   console.log('RENDERED PREVIEW ', v);
          //   return 'testing';
          // }}
          previewValue={(v) => moment(v).format('DD-MM-YYYY')}
        /> */}
        <UpdateUserForm
          defaultUsers={task.assignees as any}
          model="task"
          updateId={task.id}
          modelFieldName="assignees"

          // saveChangesDependancies={[isOpen]}
          // useMutationProps={{ changeUiKey: queryKey, invalidateClientChanges: true }}
        />
      </div>
    );
  }, [task]);

  const openTaskDetailsModal = () =>
    setContent &&
    setContent({
      header: (
        <CustomEditable
          allSx={{ w: 'auto', display: 'inline-block' }}
          inputProps={{ sx: { fontSize: '2rem' } }}
          onSubmit={updateThisTask('title')}
          value={task.title}
        />
      ),
      body: <TaskDetails />,
    });
  return { openTaskDetailsModal };
};
