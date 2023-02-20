import { getDatesInRange } from 'utils/getDatesInRange';
import moment from 'moment';
import { Task } from '@prisma/client';

export function getTasksGroupedByDates(
  tasks: Task[],
  dateRangeCount: number,
  dateDifferenceUnits: moment.unitOfTime.DurationConstructor,
  startDate: moment.Moment | string | Date = moment().subtract(
    dateRangeCount - 1,
    dateDifferenceUnits
  ),
  direction: 'prev' | 'next' = 'next'
) {
  const dates = getDatesInRange(
    dateRangeCount,
    dateDifferenceUnits,
    startDate,
    direction
  );

  return dates.map((date) => {
    const tasksForDate = tasks?.filter((task) => {
      const taskDate = moment(task?.dueDate);
      return taskDate?.isSame(date, dateDifferenceUnits);
    });

    return {
      date: date.format('YYYY-MM-DD'),
      tasks: tasksForDate,
    };
  });
}
