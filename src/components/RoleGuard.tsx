import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
import { useUser } from 'lib-client/hooks/useUser';

type userRole = 'admin' | 'manager' | 'emp';

interface IProps {
  children: React.ReactNode;
  allowed: userRole[] | userRole;
  fallback?: React.ReactFragment | JSX.Element;
}

const defaultProps: Partial<IProps> = {
  fallback: <></>,
};

export function RoleGuard(props: IProps): React.ReactFragment | JSX.Element {
  const { children, allowed, fallback } = { ...defaultProps, ...props };

  const user = useUser();
  const isHydrated = useIsHydrated();

  if (!isHydrated) return fallback;

  if (isHydrated && !user?.id) {
    console.error('User is not logged in');
    return fallback;
  }
  if (isHydrated && !user?.role?.id) {
    console.error('User role not found');
    return fallback;
  }

  const userRole = user.role.label;

  const userIsPermitted =
    typeof allowed === 'string'
      ? userRole === allowed
      : allowed.some((role) => role === userRole);

  if (!userIsPermitted) return fallback;

  return <>{children}</>;
}
