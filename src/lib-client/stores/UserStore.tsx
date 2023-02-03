import { createStore } from 'lib-client/hooks/createStore';

export type Roles = 'admin' | 'client' | 'contractor' | 'emp';
export const roles: Roles[] = ['admin', 'client', 'contractor', 'emp'];

export interface IUserStore {
  username: string;
  setUsername: (username: string) => void;
}
export const useUserStore = createStore<IUserStore>('User', (set) => ({
  username: '',
  setUsername: (username: string) => set({ username }),
}));
