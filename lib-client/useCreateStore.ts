import create, { StateCreator, StoreApi } from 'zustand';
import { isDevEnv } from 'utils/isDevEnv';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { createTrackedSelector } from 'react-tracked';
import { useIsHydrated } from 'hooks/useIsHydrated';

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
  // devtools showing data in store avaiable at root of html body tag

  return () => {
    const store = createTrackedSelector(useStore)();
    return useIsHydrated() ? store : (getDehydratedStore(initializer) as StoreType);
  };
};

// HELPERS FOR PREVENTING HYDRATION ERRORS IN NEXT.JS

// to prevent hydration errors, first initialise "store" using only variables, no functions.
// functions require set() to work and set is only available AFTER hydration.

// utils for dehydrated itialising store WIHTOUT any functions
const initialiseDehydratedStore = (initializer: StateCreator<any, [], []>) =>
  initializer(
    () => null,
    () => null as any,
    null as unknown as StoreApi<any>
  );

// filter "functions" (which dont work) out of the dehydrated store
const getDehydratedStore = (initializer: StateCreator<any, [], []>) => {
  return Object.fromEntries(
    Object.entries(initialiseDehydratedStore(initializer)).filter(
      ([k, v]) => typeof v !== 'function'
    )
  );
};
