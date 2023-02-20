import { getDatesInRange } from 'utils/getDatesInRange';
import moment from 'moment';
import { Task, TaskStatus } from '@prisma/client';

export function getTasksGroupedByStatuses(tasks: Task[], statuses: TaskStatus[]) {
  return statuses.map((status) => {
    const tasksForStatus = tasks?.filter((task) => task.statusId === status.id);
    return {
      status,
      tasks: tasksForStatus,
    };
  });
}

export function getTaskCountByNormalStatuses(tasks: Task[], statuses: TaskStatus[]) {
  const tasksByStatus = getTasksGroupedByStatuses(tasks, statuses);

  const todo = tasksByStatus[0].tasks.length;
  const inProgress = tasksByStatus[1].tasks.length;
  const done = tasksByStatus[2].tasks.length;

  return {
    todo,
    inProgress,
    done,
  };
}

export function getClosedStatuses(projects: Record<'statuses', TaskStatus[]>[]) {
  const closedStatuses = projects.map((project) => {
    const lastStatus = project.statuses[project.statuses.length - 1];
    return lastStatus;
  });
  return closedStatuses;
}

export function getClosedTasks(tasks: Task[], closedStatuses: TaskStatus[]) {
  const closedTasks = tasks.filter((task) => {
    return closedStatuses.some((status) => status.id === task.statusId);
  });
  return closedTasks;
}
