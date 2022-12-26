import { useCreateStore } from 'lib-client/hooks/useCreateStore';

interface IPage {
  [key: string]: any;
}

export interface ILayoutStore {
  activePage: IPage;
  setActivePage: (page: IPage) => void;
  sideNavIsOpen: boolean;
  setSideNavIsOpen: (isOpen: boolean) => void;
  toggleSideNavIsOpen: () => void;
}

export const useLayoutStore = useCreateStore<ILayoutStore>('Layout', (set) => ({
  activePage: {},
  setActivePage: (page: IPage) => set({ activePage: page }),
  sideNavIsOpen: false,
  setSideNavIsOpen: (isOpen: boolean) => set({ sideNavIsOpen: isOpen }),
  toggleSideNavIsOpen: () =>
    set((s) => ({
      sideNavIsOpen: !s.sideNavIsOpen,
    })),
}));
