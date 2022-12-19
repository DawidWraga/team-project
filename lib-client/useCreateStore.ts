import create, { StateCreator, StoreApi } from 'zustand';
import { isDevEnv } from 'utils/isDevEnv';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { createTrackedSelector } from 'react-tracked';
import { useIsHydrated } from 'hooks/useIsHydrated';

const initialiseWithoutStore = (initializer: StateCreator<any, [], []>) =>
  initializer(
    () => null,
    () => null as any,
    null as unknown as StoreApi<any>
  );

const getInitialState = (initializer: StateCreator<any, [], []>) => {
  return Object.fromEntries(
    Object.entries(initialiseWithoutStore(initializer)).filter(
      ([k, v]) => typeof v !== 'function'
    )
  );
};

export const useCreateStore = <StoreType>(
  identifier: string,
  initializer: StateCreator<StoreType, [], []>
) => {
  const useStore = create<StoreType>(initializer);

  if (
    typeof window !== 'undefined' &&
    isDevEnv &&
    !Boolean(document?.getElementById(`simple-zustand-devtools-${identifier}`)) //avoid remounting the same dev tools
  )
    mountStoreDevtool(identifier, useStore);

  return () => {
    const store = createTrackedSelector(useStore)();
    return useIsHydrated() ? store : (getInitialState(initializer) as StoreType);
  };
};
