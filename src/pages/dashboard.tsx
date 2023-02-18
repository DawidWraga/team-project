import { PageWrapper } from 'layouts/PageWrapper';
import { DateInput } from 'components/DateInput';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useUser } from 'lib-client/hooks/useUser';
import { useRouter } from 'next/router';

export default function DashboardPage(props) {
  const {} = props;

  const router = useRouter();
  const user = useUser();

  return (
    <PageWrapper w="2xl">
      {/* {data ? JSON.stringify(data) : 'No data'} */}
      {user ? JSON.stringify(user) : 'No user'}
      <button onClick={() => router.push('/auth')}>auth</button>
      {/* <DateInput /> */}
    </PageWrapper>
  );
}
