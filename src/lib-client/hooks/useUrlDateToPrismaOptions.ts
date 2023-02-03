import { useUrlData } from 'lib-client/hooks/useUrlData';

type optionsOrObj = {} | Record<'gte' | 'lte', Date>;

export function useUrlDateToPrismaOptions(): optionsOrObj {
  const query = useUrlData('queryParams');

  const getDate = (str: string | undefined) => (str ? new Date(str) : undefined);

  return {
    gte: getDate(query.startDate as string),
    lte: getDate(query.endDate as string),
  };
}
