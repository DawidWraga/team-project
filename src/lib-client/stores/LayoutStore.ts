import { IPage, IRouteData } from 'config/pages';
import {
  closedSideNavWidth,
  headerHeight,
  mobileBottomBarHeight,
  openSideNavWidth,
  optionBarHeight,
} from 'lib-client/constants';
import { createStore } from 'lib-client/hooks/createStore';
import { useEffect } from 'react';

type offsetProp = {
  base: string;
  lg?: string;
};

export interface ILayoutStore {
  activePage: IPage;
  setActivePage: (page: IPage) => void;
  sideNavIsOpen: boolean;
  setSideNavIsOpen: (isOpen: boolean) => void;
  toggleSideNavIsOpen: () => void;
  optionBar: React.ReactNode | undefined;
  setOptionBar: (content: React.ReactNode) => void;
  useSetOptionBar: (content: React.ReactNode, dependencies?: any[]) => void;
  optionBarIsOpen: boolean;
  closeOptionBar: () => void;
  leftOffset: offsetProp;
  topOffset: offsetProp;
  bottomOffset: offsetProp;
  openAccordianRoute: string;
  setOpenAccordianRoute: (route: string) => void;
  activeSideNavLink: IRouteData | undefined;
  setActiveSideNavLink: (page: IRouteData) => void;
}

export const getLeftOffset = (isOpen: boolean) => {
  if (isOpen) return { base: '0px', lg: openSideNavWidth + closedSideNavWidth + 'px' };
  else
    return {
      base: 0 + 'px',
      lg: closedSideNavWidth + 'px',
    };
};

export const useLayoutStore = createStore<ILayoutStore>('Layout', (set, get) => ({
  // ======== active page ========
  activePage: {} as any,
  setActivePage: (page: IPage) => set({ activePage: page }),
  // ======== sidenav ========
  sideNavIsOpen: false,
  setSideNavIsOpen: (isOpen: boolean) =>
    set({
      sideNavIsOpen: isOpen,
      leftOffset: getLeftOffset(isOpen),
    }),
  toggleSideNavIsOpen: () =>
    set((s) => ({
      leftOffset: getLeftOffset(!s.sideNavIsOpen),
      sideNavIsOpen: !s.sideNavIsOpen,
    })),

  // ======== option bar ========
  optionBar: undefined,
  setOptionBar: (content: React.ReactNode) => {
    if (!content) return;
    set({
      optionBar: content,
      optionBarIsOpen: true,
      topOffset: { base: headerHeight + optionBarHeight + 'px' },
    });
  },
  useSetOptionBar(content: React.ReactNode, dependencies: any[] = []) {
    useEffect(() => {
      get().setOptionBar(content);
    }, dependencies);
  },
  optionBarIsOpen: false,
  closeOptionBar: () =>
    set({
      optionBarIsOpen: false,
      topOffset: { base: headerHeight + 'px' },
    }),
  // ======== offset ========
  leftOffset: { base: 0 + 'px', lg: closedSideNavWidth + 'px' },
  topOffset: { base: headerHeight + 'px' },
  bottomOffset: { base: mobileBottomBarHeight + 'px', lg: 0 + 'px' },
  openAccordianRoute: '',
  setOpenAccordianRoute: (route: string) =>
    set((state) => {
      // toggle open state
      if (state.openAccordianRoute === route) return { openAccordianRoute: '' };
      return { openAccordianRoute: route };
    }),
  activeSideNavLink: undefined,
  setActiveSideNavLink: (page: IRouteData) => set({ activeSideNavLink: page }),
}));
