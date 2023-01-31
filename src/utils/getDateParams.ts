import moment from 'moment';

export function getDateParams() {
  // set the start date to the first day of the current month
  const start = moment().startOf('month').format('MM-DD-YYYY');
  // set the end date to the last day of the current month
  const end = moment().endOf('month').format('MM-DD-YYYY');
  // return a string with the formatted start and end dates
  return `startDate=${start}&endDate=${end}`;
}
