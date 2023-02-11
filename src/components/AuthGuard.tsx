import { useSession } from 'next-auth/react';
import { Loading } from '@saas-ui/react';
import { useRouter } from 'next/router';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
interface IProps {
  children: React.ReactNode;
}

export default function AuthGuard(props: IProps) {
  const { children } = props;
  const router = useRouter();
  const isHydrated = useIsHydrated();

  const { status } = useSession();

  // ======= HANDLE LOADING ======
  if (status === 'loading') {
    return <Loading variant="fullscreen" />;
  }

  // ======= HANDLE UNAUTHENTICATED ======
  if (status === 'unauthenticated') {
    if (['/register', '/auth'].includes(router.asPath)) {
      return <>{children}</>;
    } else {
      router.replace('/auth');
      return <Loading variant="fullscreen" />;
    }
  }

  // ======= HANDLE AUTHENTICATED ======
  if (status === 'authenticated') {
    return <>{children}</>;
  } else return <>{children}</>; //there are only 3 status optios therefore the else will never run. Here purely for type safety
}
