import { QueryClient } from 'react-query';

const msInSec = 1000;
const secInMin = 60;
export const queryClient = new QueryClient();
export const QUERY_STALE_TIME = 5 * msInSec * secInMin;

export const LAYOUT_DISABLED_ROUTES = ['/auth', '/register'];

export const headerHeight = 60;
export const optionBarHeight = 46;
export const openSideNavWidth = 200;
export const closedSideNavWidth = 0;
export const mobileBottomBarHeight = 0;
