import { useCreateStore } from 'lib-client/hooks/useCreateStore';

export type Roles = 'admin' | 'client' | 'contractor' | 'emp';
export const roles: Roles[] = ['admin', 'client', 'contractor', 'emp'];

export interface IUserStore {
  userRole: Roles;
  setUserRole: (userRole: Roles) => void;
  resourceId: number;
  setResourceId: (id: number) => void;
}
5;
export const useUserStore = useCreateStore<IUserStore>('User', (set) => ({
  userRole: 'admin',
  setUserRole: (userRole: Roles) => set({ userRole }),
  resourceId: 1,
  setResourceId: (id: number) => set({ resourceId: id }),
}));
