import { createStore } from 'lib-client/hooks/createStore';

export interface IFilterStore {
  onlyMe: boolean;
  toggleOnlyMe: () => void;
  taskViewMode: 'manhours' | 'count';
  setTaskViewMode: (mode: 'manhours' | 'count') => void;
  toggleTaskViewMode: () => void;
}
export const useFilterStore = createStore<IFilterStore>('filterStore', (set) => ({
  onlyMe: false,
  toggleOnlyMe: () => set((state) => ({ onlyMe: !state.onlyMe })),
  taskViewMode: 'manhours',
  setTaskViewMode: (mode) => set({ taskViewMode: mode }),
  toggleTaskViewMode: () =>
    set((state) => ({
      taskViewMode: state.taskViewMode === 'manhours' ? 'count' : 'manhours',
    })),
}));
