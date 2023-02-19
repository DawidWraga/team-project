import { User, UserRole } from '@prisma/client';
import { controller } from 'lib-client/controllers';
import { useSession } from 'next-auth/react';

export function useUser() {
  const session = useSession();

  const userEmail = session?.data?.user?.email;

  const { data: user } = controller.useQuery({
    model: 'user',
    query: 'findUnique',
    prismaProps: {
      where: {
        email: userEmail,
      },
      include: {
        role: true,
      },
    },
    enabled: Boolean(session.status === 'authenticated') && Boolean(userEmail),
  });

  const roleBooleans = {
    isAdmin: user?.role?.label === 'admin',
    isManager: user?.role?.label === 'manager',
    isEmp: user?.role?.label === 'emp',
  };

  return { ...user, ...roleBooleans } as UserWithRoles;
}

type UserWithRoles = User & {
  role: UserRole;
  isAdmin: boolean;
  isManager: boolean;
  isEmp: boolean;
};
