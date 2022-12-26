import { QueryClient } from 'react-query';

const msInSec = 1000;
const secInMin = 60;
export const queryClient = new QueryClient();
export const QUERY_STALE_TIME = 5 * msInSec * secInMin;
