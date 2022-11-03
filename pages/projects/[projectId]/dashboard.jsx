import { useRouter } from 'next/router';

export default function ProjectDashboardPage(props) {
	const {} = props;

	const router = useRouter();

	return (
		<>individual project page DASHBOARD project id = {router.query.projectId}</>
	);
}
