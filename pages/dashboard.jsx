import { UserDashboard } from 'components/dashboards/UserDashboard';
import { PageWrapper } from 'styles/PageWrapper';

export default function DashboardPage(props) {
	const {} = props;

	return (
		<PageWrapper w="2xl">
			<UserDashboard />
		</PageWrapper>
	);
}
