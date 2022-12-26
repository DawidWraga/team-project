import { UserDashboard } from 'views/dashboard/UserDashboard';
import { PageWrapper } from 'layouts/PageWrapper';

export default function DashboardPage(props) {
  const {} = props;

  return (
    <PageWrapper w="2xl">
      <UserDashboard />
    </PageWrapper>
  );
}
