import query from 'controllers/query';

export async function getAllProjects() {
	return await query('projects');
}

export async function getProjectData(id) {
	const projects = await getAllProjects();
	const projectData = projects.find((p) => p.id === +id);
	return projectData;
}
