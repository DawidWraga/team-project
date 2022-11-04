interface IRouteData {
	label: string;
	route: string;
}

interface IPage {
	parentLink: IRouteData;
	sideNavLinks?: IRouteData[];
	headerLinks?: IRouteData[];
}

const projectSideNavLinks = require('db/projects.json').map((project) => {
	return {
		label: project.title,
		route: `/projects/${project.id}/dashboard`,
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
