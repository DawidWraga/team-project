import { anyQuery } from 'lib-client/controllers/createController';
import { useCreateStore } from 'lib-client/hooks/useCreateStore';
export interface IUiChangeStore {
  // k = changeUiKey, v = changed data array
  changedUiData: Record<string, any[]>;
  pushChangedUiData: (
    queryKey: string | string[],
    queryType: anyQuery,
    data: any
  ) => void;
  getChangedData: (queryKey: string | string[], queryType: anyQuery) => any[];
  resetChangedData: (queryKey: string | string[], queryType: anyQuery) => void;
}

function createId(queryKey: string | string[], queryType: anyQuery) {
  // queryKeys can be made of arrays eg [model, queryType], however, object cannot be arrays. This utility helps to format query key into object key
  // return format = changedModel_changedModelQuery_changeType
  let result: string;
  if (Array.isArray(queryKey)) {
    result = queryKey.join('_');
  } else result = queryKey;
  result += '_' + queryType;

  return result;
}

// aim = store history of mutations made using controller.writeQuery.use(mode='changeUi') in order to enable save functionality
export const useUiChangeStore = useCreateStore<IUiChangeStore>(
  'uiChangeStore',
  (set, get) => ({
    changedUiData: {},
    pushChangedUiData: (
      queryKey: string | string[],
      queryType: anyQuery,
      data: Record<any, any>
    ) =>
      set((state) => {
        const identifier = createId(queryKey, queryType);

        let previousData = state.changedUiData[identifier];

        // filter previous items with same ID to avoid sending redundant/ conflicting queries for same item - only save most recent
        if (previousData) {
          previousData = previousData.filter((item) => item.id && item.id !== data.id);
        }

        const newData = previousData ? [...previousData, data] : [data];

        return { changedUiData: { ...state.changedUiData, [identifier]: newData } };
      }),
    getChangedData: (queryKey: string | string[], queryType: anyQuery) => {
      const identifer = createId(queryKey, queryType);
      const all = get().changedUiData;

      return all[identifer];
    },
    resetChangedData: (queryKey: string | string[], queryType: anyQuery) => {
      const identifer = createId(queryKey, queryType);
      set((state) => {
        const newData = { ...state.changedUiData };
        delete newData[identifer];
        return { changedUiData: newData };
      });
    },
  })
);
