import { create, StateCreator } from 'zustand';
import { isDevEnv } from 'utils/isDevEnv';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { createTrackedSelector } from 'react-tracked';

/**
 * 
 * Create custom hook to access client-side state from any component with minimal rerenders
 * 

 * @param identifier unique identifier for store, used to mount devtools
 * @param initializer zustand state creator function
 * @returns useStore hook with tracked selector
 * 
 * @example
 * ```
 * interface IUserStore {
 *    username: string;
 *    setUsername: (username: string) => void;
 *  }
 * const useUserStore = createStore<IUserStore>('User', (set) => ({
 *    username: '',
 *    setUsername: (username: string) => set({ username }),
 *  }));
 * ```
 * 
 *  @remarks
 * -Store created using zustand
 * -Devtools mounted using simple-zustand-devtools (accessible from top of component tree in react devtools)
 * -Rerenders optimised via proxy created using react-tracked (minimises re-renders using shallow compare on state, without need for zusand selectors or custom shallow compare) 
 *

 */
export const createStore = <StoreType>(
  identifier: string,
  initializer: StateCreator<StoreType, [], []>
) => {
  const useStore = create<StoreType>(initializer);

  conditionallyMountStoreDevTools(identifier, useStore);

  return createTrackedSelector(useStore);
};

function conditionallyMountStoreDevTools(identifier: any, useStore: any) {
  if (typeof window === 'undefined') return;
  if (!isDevEnv) return;
  if (isDevToolsMounted(identifier)) return;

  mountStoreDevtool(identifier, useStore);
}

const isDevToolsMounted = (identifier: string) =>
  Boolean(document?.getElementById(`simple-zustand-devtools-${identifier}`));
