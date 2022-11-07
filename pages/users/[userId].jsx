import { Box } from '@chakra-ui/react';
import { UserDashboard } from 'components/dashboards/UserDashboard';
import { PageWrapper } from 'styles/PageWrapper';

export default function IndividualUserPage(props) {
  const {} = props;

  return (
    <PageWrapper w="2xl">
      <UserDashboard />
    </PageWrapper>
  );
}
