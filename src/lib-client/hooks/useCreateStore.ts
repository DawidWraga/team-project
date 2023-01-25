import create, { StateCreator, StoreApi } from 'zustand';
import { isDevEnv } from 'utils/isDevEnv';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { createTrackedSelector } from 'react-tracked';
import { useIsHydrated } from 'lib-client/hooks/useIsHydrated';
import { objectMap } from 'utils/objectMap';
import { useMemo } from 'react';

export const useCreateStore = <StoreType>(
  identifier: string,
  initializer: StateCreator<StoreType, [], []>
) => {
  const useStore = create<StoreType>(initializer);

  conditionallyMountStoreDevTools(identifier, useStore);

  return () => createTrackedSelector(useStore)();

  // ! decided stop spending time on fixing hydration errors as we have moved away from SSR and are fetching data on the client using react-query instead.
  // condtional store aim
  // all func are STILL func (not filtered)
  // check if hydrated before exec func

  return () => {
    const isHydrated = useIsHydrated();
    const store = createTrackedSelector(useStore)();
    const dehydratedStore = initialiseDehydratedStore(initializer) as StoreType;

    return store;
    const processedStore = useMemo(() => {
      return objectMap(store as any, (v) => {
        // only process functions
        if (typeof v !== 'function') return v;

        // return isHydrated ? v : () => null;
        return (args) => isHydrated && v(args);
      }) as StoreType;
    }, [isHydrated]);

    return isHydrated ? processedStore : dehydratedStore;
  };
};

const isDevToolsMounted = (identifier: string) =>
  Boolean(document?.getElementById(`simple-zustand-devtools-${identifier}`));

function conditionallyMountStoreDevTools(identifier: any, useStore: any) {
  // devtools showing data in store avaiable at root of html body tag
  if (typeof window === 'undefined') return;
  if (isDevEnv) return;
  if (isDevToolsMounted(identifier)) return;

  mountStoreDevtool(identifier, useStore);
}

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
