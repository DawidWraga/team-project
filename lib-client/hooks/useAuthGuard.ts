import { getCurrentUser } from 'lib-client/controllers/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';

export const useAuthGuard = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const isSignedIn = await getCurrentUser();
      if (!isSignedIn && router.asPath !== '/register') {
        router.replace('/auth');
        await setTimeoutPromise(200);
      }

      if (isSignedIn && router.pathname === '/') {
        router.replace('/dashboard');
      }

      setLoading(false);
    })();
  }, []);
  return { loading };
};
