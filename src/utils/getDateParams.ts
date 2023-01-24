import moment from 'moment';

export function getDateParams() {
  const start = moment().startOf('month').format('MM-DD-YYYY');
  const end = moment().endOf('month').format('MM-DD-YYYY');
  return `startDate=${start}&endDate=${end}`;
}
