import { controller } from 'lib-client/controllers/Controller';
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

  return user;
}
