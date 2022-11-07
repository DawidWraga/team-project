interface IRouteData {
	label: string;
	route: string;
	defaultHeaderLink?: string;
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
			defaultHeaderLink: '/tasks',
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
		sideNavLinks: [
			{
				label: 'Welcome to docs',
				route: '/docs/welcome',
				defaultHeaderLink: '',
			},
			{
				label: 'Printing',
				route: '/docs/printing',
				defaultHeaderLink: '',
			},
			{
				label: 'Software configs',
				route: '/docs/software',
				defaultHeaderLink: '',
			},
			{
				label: 'Resources',
				route: '/docs/resources',
				defaultHeaderLink: '',
			},
			{
				label: 'Contacts',
				route: '/docs/contacts',
				defaultHeaderLink: '',
			},
			{
				label: 'Our mission',
				route: '/docs/mission',
				defaultHeaderLink: '',
			},
		],
	},
	{
		parentLink: {
			label: 'Users',
			route: '/users',
		},
		sideNavLinks: usersNavLinks,
	},
];

export default pages;
