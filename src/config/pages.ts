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

const projectSideNavLinks: IRouteData[] = require('db/projects.json').map((project) => {
  return {
    label: project.title,
    route: `/projects/${project.id}`,
    defaultHeaderLink: '/dashboard',
  };
});

const forumSideNavLinks: IRouteData[] = require('db/topics.json').map((topic) => {
  return {
    label: topic.title,
    route: `/forums?topicId=${topic.id}`,
    defaultHeaderLink: '',
  };
});
const usersNavLinks: IRouteData[] = require('db/users.json').map((user) => {
  return {
    label: user.fullName,
    route: `/users/${user.id}`,
    defaultHeaderLink: '',
  };
});

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
        route: '/dashboard',
      },
      {
        label: 'tasks',
        route: '/tasks' + '?' + getDateParams(),
        hasOptionBar: true,
      },
    ],
    // sideNavLinks: projectSideNavLinks,
  },
  {
    parentLink: {
      label: 'Forums',
      route: '/forums',
    },
    sideNavLinks: forumSideNavLinks,
    // headerLinks: [
    //   {
    //     label: 'unsolved',
    //     route: '&filter=unsolved',
    //   },
    //   {
    //     label: 'solved',
    //     route: '&filter=solved',
    //   },
    // ],
  },

  {
    parentLink: {
      label: 'Users',
      route: '/users',
    },
    sideNavLinks: usersNavLinks,
  },
  {
    parentLink: {
      label: 'DocsNew',
      route: '/docsnew',
      hasOptionBar: true,
    },
  },
  {
    parentLink: {
      label: 'Example',
      route: '/example',
      hasOptionBar: true,
    },
  },
];

export default pages;
