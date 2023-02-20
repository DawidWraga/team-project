import moment, { Moment } from 'moment';

export const getDatesInRange = (
  dateRangeCount: number,
  dateDifferenceUnits: moment.unitOfTime.DurationConstructor,
  startDate: Moment | string | Date = moment(),
  direction: 'prev' | 'next' = 'next'
) => {
  const start = moment(startDate).startOf(dateDifferenceUnits);

  let dates: any = [];
  for (let i = 0; i < dateRangeCount; i++) {
    if (direction === 'prev') {
      dates.push(start.clone().subtract(i, dateDifferenceUnits));
    } else {
      dates.push(start.clone().add(i, dateDifferenceUnits));
    }
  }

  return dates;
};
