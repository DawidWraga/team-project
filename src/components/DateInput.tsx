import { useState, useEffect, forwardRef } from 'react';
import { DateInput as _DateInput, DateInputProps } from '@saas-ui/date-picker';
export const DateInput = forwardRef((props: DateInputProps, ref) => {
  const { dateValue, value, ...restProps } = {
    granularity: 'day',
    ...props,
  } as any;

  const [DateInput, setDateInput] = useState<typeof _DateInput | null>(null);
  // const [parseDate, setParseDate] = useState<((value: string) => any) | null>(() => null);
  useEffect(() => {
    (async () => {
      const { DateInput, parseDate } = await import('@saas-ui/date-picker');

      // console.log('🔷 >> parseDate', parseDate);
      setDateInput(DateInput);
      // setParseDate(parseDate);
    })();
  }, []);

  // need to convert the dateVluae from input and onChange into the internaionalised date format

  return DateInput ? (
    <DateInput ref={ref} {...restProps} value={dateValue || value} />
  ) : (
    (null as any)
  );
});

DateInput.displayName = 'DateInput';

function getParsedDate(dateStr: string) {}

// past attempt - got it to work when convered types and imoprtned from @saas-ui/date-picker

// {
/* <Input
name="dueDate"
customInput={({ field: { value, ...field } }) => {
  return (
    <>
      <DateInput />
    </>
  );
  const [Input2, setInput] = useState<any>(<DateInput />);

  useEffect(() => {
    import('@saas-ui/date-picker').then(({ parseDate }) => {
      const parsed = !value?.calendar?.identifier
        ? parseDate(
            new Date(value || new Date()).toISOString().split('T')[0]
          )
        : value;

      setInput(() => {
        return (
          <DateInput
            value={parsed}
            onChange={(newVal) => {
              setValue('dueDate', newVal);
            }}
            granularity="day"
          />
        );
      });
    });
  }, [value]);

  return <>{Input2}</>;
}}
/> */
// }
