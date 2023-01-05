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
  // format query key: changedModel_changedModelQuery_changeType
  let result: string;
  if (Array.isArray(queryKey)) {
    result = queryKey.join('_');
  } else result = queryKey;
  result += '_' + queryType;
  console.log({ result, queryKey, queryType });

  return result;
}

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

        const previousData = state.changedUiData[identifier];
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
