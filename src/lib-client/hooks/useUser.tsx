import { Project, Task, User, UserRole } from '@prisma/client';
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
        tasksAssigned: {
          include: {
            // project: true,
            status: true,
          },
        },
        projectsAssigned: {
          select: {
            statuses: true,
          },
        },
      },
    },
    staleTime: 1000 * 60, // 1 minute
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
  tasksAssigned: Task[];
  projectsAssigned: Project[];
  isAdmin: boolean;
  isManager: boolean;
  isEmp: boolean;
};
