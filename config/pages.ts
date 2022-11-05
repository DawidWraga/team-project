interface IRouteData {
	label: string;
	route: string;
}

interface IPage {
	parentLink: IRouteData;
	sideNavLinks?: IRouteData[];
	headerLinks?: IRouteData[];
}

const projectSideNavLinks: IRouteData[] = require('db/projects.json').map(
	(project) => {
		return {
			label: project.title,
			route: `/projects/${project.id}`,
			defaultHeaderLink: '/dashboard',
		};
	}
);

const forumSideNavLinks: IRouteData[] = require('db/topics.json').map(
	(topic) => {
		return {
			label: topic.title,
			route: `/forums?topicId=${topic.id}`,
			defaultHeaderLink: '',
		};
	}
);

const pages: IPage[] = [
	{
		parentLink: {
			label: 'Home',
			route: '/dashboard',
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
				route: '/tasks',
			},
		],
		sideNavLinks: projectSideNavLinks,
	},
	{
		parentLink: {
			label: 'Forums',
			route: '/forums',
		},
		sideNavLinks: forumSideNavLinks,
		headerLinks: [
			{
				label: 'all',
				route: '&filter=none',
			},
			{
				label: 'unsolved',
				route: '&filter=unsolved',
			},
			{
				label: 'solved',
				route: '&filter=solved',
			},
		],
	},
	{
		parentLink: {
			label: 'Docs',
			route: '/docs',
		},
	},
	{
		parentLink: {
			label: 'Users',
			route: '/users',
		},
	},
];

export default pages;
