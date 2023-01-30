import { ButtonWithArrows } from 'components/ButtonWithArrows';
import { useRouter } from 'next/router';
import { Box, Select as ChackraSelect, Flex, Text } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNextQueryParams, useUrlData } from 'lib-client/hooks/useNextQueryParams';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
import { useChakraForm } from 'lib-client/hooks/useChakraForm';
import { z } from 'zod';
import { colors } from 'styles/chakra-theme';

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

export const formatDate = (date, unit = 'month') => {
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
  // const query = useNextQueryParams();
  // const dateRangeUnits: moment.unitOfTime.StartOf = props.dateRangeUnits ?? 'month';
  const router = useRouter();
  const { startDate, endDate } = useUrlData('queryParams') as any;

  // const query = useNextQueryParams<{}>();

  const isHydrated = useIsHydrated();

  // const [unit, setUnit] = useState<moment.unitOfTime.DurationConstructor>('month');
  // const [selectedDateString, setSelectedDateString] = useState(formatDate(date, unit));

  const { Input, getValues, watch } = useChakraForm<{
    date: { label: string; value: moment.unitOfTime.DurationConstructor };
  }>({
    schema: z.object({
      date: z.object({
        label: z.string(),
        value: z.string(),
      }),
    }) as any,
    defaultValues: {
      date: {
        label: 'Month',
        value: 'month',
      },
    },
  });

  const urlQuery = useUrlData<{ startDate: string; endDate: string }>('queryParams');
  const modifyDateAndRoute = async (dir?: 'prev' | 'next') => {
    const unit = getValues().date?.value;
    const startDate = moment(urlQuery?.startDate || '').startOf(unit);
    if (!unit) return;
    // save changed data before routing
    saveChangesBeforeRouting && (await saveChangesBeforeRouting());

    // calculate new date
    let targetDate = moment(startDate, 'MM/DD/YYYY');
    if (dir === 'next') targetDate = targetDate.add(1, unit);
    if (dir === 'prev') targetDate = targetDate.subtract(1, unit);

    const query = {
      ...router.query,
      startDate: targetDate.format('MM-DD-YYYY'),
      endDate: targetDate.endOf(unit).format('MM-DD-YYYY'),
    };

    isHydrated && router.push({ query });
    // change date string
    // setSelectedDateString(formatDate(targetDate, unit));
  };

  const dateUnit = watch()?.date?.value;

  useEffect(() => {
    modifyDateAndRoute();
  }, [dateUnit]);

  return (
    <>
      <Flex gap={4} alignItems="center">
        <ButtonWithArrows
          containerProps={{
            sx: { w: 165 },
          }}
          leftProps={{
            onClick: () => modifyDateAndRoute('prev'),
            'aria-label': 'previous date range',
            type: 'submit',
          }}
          rightProps={{
            onClick: () => modifyDateAndRoute('next'),
            'aria-label': 'next date range',
            type: 'submit',
          }}
          centerProps={{ sx: { borderRadius: '0px !important', width: 80 } }}
          centerContent={
            <>
              <Input
                name="date"
                hideLabel={true}
                customInput={({ field }) => {
                  return (
                    <Select
                      {...field}
                      variant="unstyled"
                      {...props}
                      // colorScheme="hsl(32, 100%, 53%)"
                      // selectedOptionColor="orange"
                      // defaultInputValue="month"
                      isSearchable={false}
                      chakraStyles={{
                        dropdownIndicator: (prev) => ({
                          ...prev,
                          display: 'none',
                        }),

                        container: (prev) => ({
                          ...prev,
                          bgColor: 'blue.800',
                          rounded: 'none',
                          borderRadius: 0,
                          color: 'white',
                          textAlign: 'center',
                          '&:hover': {
                            cursor: 'pointer',
                          },
                        }),
                        valueContainer: (prev) => ({
                          ...prev,
                          bgColor: 'blue.800',
                          textAlign: 'center',
                          borderX: '1px solid lightGray',
                          my: 1,
                          justifyContent: 'center',
                          // px: 'auto',
                          // mx: 'auto',
                          // pl: 3,
                        }),

                        placeholder: (prev) => ({
                          ...prev,
                          textAlign: 'center',
                          bgColor: 'blue.800',
                          // pl: 5,
                        }),
                        input: (prev) => ({
                          ...prev,
                          textAlign: 'center',
                        }),
                        menuList: (prev) => ({
                          ...prev,
                          zIndex: 999999999999,
                          color: 'black',
                        }),
                      }}
                      id="date"
                      // defaultValue={{ label: 'Month', value: 'month' }}
                      // defaultValue={'month'}
                      isClearable={false}
                      options={[
                        {
                          label: 'Year',
                          value: 'year',
                        },
                        {
                          label: 'Month',
                          value: 'month',
                        },
                        {
                          label: 'Week',
                          value: 'week',
                        },
                        {
                          label: 'Day',
                          value: 'day',
                        },
                      ]}
                    />
                  );
                }}
              />
            </>
          }
        />
        <Box bgColor="whiteAlpha.600" px="3" py="1" rounded="md">
          <Text fontWeight={'semibold'} fontSize={'1.1rem'} textTransform={'uppercase'}>
            {moment(startDate).format('DD MMMM yyyy ')}
            {dateUnit !== 'day' && (
              <>
                <Box as="span" pr="2px" mx="10px">
                  -
                </Box>
                {moment(endDate).format('DD MMMM yyyy ')}
              </>
            )}
          </Text>
        </Box>
      </Flex>
    </>
  );
}
{
  /* overlay description text over dropdown */
}
{
  /* <Box
            position="absolute"
            w="100%"
            h="100%"
            top={'25%'}
            left={0}
            zIndex={1000}
            textColor="white"
            pointerEvents={'none'}
            _hover={{ cursor: 'pointer' }}
            borderRadius="0px !important"
            fontWeight={500}
          >
            {selectedDateString}
          </Box> */
}
