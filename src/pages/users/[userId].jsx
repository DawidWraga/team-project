import { Box } from '@chakra-ui/react';
import { UserDashboard } from 'views/dashboard/UserDashboard';
import { PageWrapper } from 'layouts/PageWrapper';

export default function IndividualUserPage(props) {
  const {} = props;

  return (
    <PageWrapper w="2xl">
      <UserDashboard />
    </PageWrapper>
  );
}
