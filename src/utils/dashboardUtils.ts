import { Task } from '@prisma/client';
import { CompleteTask } from 'prisma/zod';

interface IGetProjectStatusesReturn {
  startStatus: number;
  endStatus: number;
}

export function getProjectStatuses(project: Record<any, any>) {
  // get statuses array
  if (!project) return;
  const { statuses } = project;
  // get first and last status
  const first = statuses[0];
  const last = statuses[statuses.length - 1];

  // put them into object with right names and return
  return {
    startStatus: first,
    endStatus: last,
  };
}

export function getTasksByStatus(tasks: any[], statusId: number) {
  // loop through all tasks
  // if task status === targetStatusId then keep; otherwise delete

  const tasksWithTargetStatus = tasks?.filter((task) => task.statusId === statusId);

  return tasksWithTargetStatus;
}

export function getTasksByAssignee(tasks: CompleteTask[], assigneeId: number) {
  const tasksWithTargetAssignee = tasks?.filter((task) => {
    const atLeastOneUserMatches = task.assignees?.some(
      (assignee) => assignee.id === assigneeId
    );

    return atLeastOneUserMatches;
  });

  return tasksWithTargetAssignee;
}
