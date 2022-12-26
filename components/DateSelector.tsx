import { ButtonWithArrows } from 'components/ButtonWithArrows';
import { useRouter } from 'next/router';
import { Box, Select } from '@chakra-ui/react';
import moment from 'moment';
import { useState } from 'react';

interface IProps {
  saveChangesBeforeRouting?: () => Promise<void>;
}

const unitToFormat = {
  year: 'YYYY',
  month: 'MMMM',
  day: 'MMM DD',
  week: 'MMM DD',
};

const formatOrdinalNum = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const formatDate = (date, unit = 'month') => {
  let dateString = moment(date, 'MM/DD/YYYY').format(unitToFormat[unit]);

  if (unit === 'week')
    dateString +=
      ' - ' + moment(date, 'MM/DD/YYYY').add(1, 'week').format(unitToFormat[unit]);

  if (unit === 'day') {
    dateString =
      dateString.slice(0, -2) + formatOrdinalNum(dateString.slice(-2, dateString.length));
  }
  return dateString.toString();
};

export function DateSelector(props: IProps) {
  const { saveChangesBeforeRouting } = props;
  const router = useRouter();
  let date = router.query.date ?? moment();

  const [unit, setUnit] = useState<moment.unitOfTime.DurationConstructor>('month');
  const [selectedDateString, setSelectedDateString] = useState(formatDate(date, unit));

  const modifyDateAndRoute = async (dir: 'prev' | 'next') => {
    // save changed data before routing
    saveChangesBeforeRouting && (await saveChangesBeforeRouting());

    // calculate new date
    let targetDate = moment(date, 'MM/DD/YYYY');
    if (dir === 'next') targetDate = targetDate.add(1, unit);
    if (dir === 'prev') targetDate = targetDate.subtract(1, unit);

    // change query
    router.push({
      query: {
        date: targetDate.format('MM-DD-YYYY'),
      },
    });
    // change date string
    setSelectedDateString(formatDate(targetDate, unit));
  };

  return (
    <ButtonWithArrows
      leftProps={{
        onClick: () => modifyDateAndRoute('prev'),
        'aria-label': 'previous date range',
      }}
      rightProps={{
        onClick: () => modifyDateAndRoute('next'),
        'aria-label': 'next date range',
      }}
      centerContent={
        <>
          <Select
            sx={{
              '& > *': { textColor: 'black' },
              borderColor: 'transparent',
              pr: 0,
              textAlign: 'center',
              transition: 'min-width 500ms',
              minW: (() => {
                if (unit === 'week') return '140px';
                if (unit === 'month') return '80px';
                if (unit === 'day') return '70px';
                if (unit === 'year') return '60px';
              })(),
            }}
            _hover={{
              borderBottom: '1px solid white',
            }}
            rootProps={{
              sx: {
                '& .chakra-select__icon-wrapper': { display: 'none' }, //hide default dropdown icon
              },
              title: 'select date',
            }}
            // text
            variant="flushed"
            colorScheme={'brand'}
            position="relative"
            textColor="transparent"
            onChange={(ev) => {
              setUnit(ev.target.value as moment.unitOfTime.DurationConstructor);
              setSelectedDateString(formatDate(date, ev.target.value));
            }}
          >
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </Select>
          {/* overlay description text over dropdown */}
          <Box
            position="absolute"
            w="100%"
            h="100%"
            top={'25%'}
            left={0}
            zIndex={1000}
            textColor="white"
            pointerEvents={'none'}
          >
            {selectedDateString}
          </Box>
        </>
      }
    />
  );
}
