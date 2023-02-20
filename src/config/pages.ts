import { getDateParams } from 'utils/getDateParams';

export interface IRouteData {
  label: string;
  route: string;
  defaultHeaderLink?: string;
  hasOptionBar?: boolean;
}

export interface IPage {
  parentLink: IRouteData;
  sideNavLinks?: IRouteData[];
  headerLinks?: IRouteData[];
}

const pages: IPage[] = [
  {
    parentLink: {
      label: 'Home',
      route: '/dashboard',
    },
  },
  {
    parentLink: {
      label: 'Docs',
      route: '/docs',
    },
  },
  {
    parentLink: {
      label: 'Projects',
      route: '/projects',
    },
    headerLinks: [
      {
        label: 'dashboard',
        route: '/dashboard' + '?' + getDateParams(),
        hasOptionBar: true,
      },
      {
        label: 'tasks',
        route: '/tasks' + '?' + getDateParams(),
        hasOptionBar: true,
      },
    ],
  },
];

export default pages;
