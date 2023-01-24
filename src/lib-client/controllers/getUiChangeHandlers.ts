import { useUiChangeStore } from 'lib-client/stores/UiChangeStore';
import { useQueryClient } from 'react-query';

export function useChangeQueryState(hookProps?: {
  query?: 'upsert' | 'update' | 'delete' | 'create';
  changeUiKey?: string | string[];
}) {
  const queryClient = useQueryClient();
  const { createItemId } = useUiChangeStore();

  // ======= change client side data logic ======
  const changeQueryState = async <T extends Record<'id' | any, any>>(props: {
    newItem: T;
    query?: 'upsert' | 'update' | 'delete' | 'create';
    changeUiKey?: string | string[];
  }) => {
    const { query, newItem, changeUiKey } = { ...hookProps, ...props };
    const item = { ...newItem };
    if (!query || !changeUiKey)
      throw new Error(
        'must "query" and "changeUIKey" args into changeQueryState OR useChangeQueryState.'
      );

    // prevent refetches to stop them from overwriting optimistic update
    await queryClient.cancelQueries({ queryKey: changeUiKey });

    // Snapshot the previous value
    const previousState = queryClient.getQueryData(changeUiKey!) || [];

    if (!item.id) (item as any).id = createItemId();
    // Optimistically update to the new value
    queryClient.setQueryData(changeUiKey!, getUiChangeHandler(query as any, item));

    // Return a context object with the snapshotted value
    return { previousState };
  };

  return { changeQueryState };
}

export const getUiChangeHandler = <T extends Record<'id' | any, any>>(
  query: 'upsert' | 'update' | 'delete' | 'create',
  newItem: T
) => {
  const handlers = {
    upsert: (prev: T[] = []) => {
      const existingIndex = prev.findIndex((it) => it?.id == newItem?.id);
      const isNew = existingIndex === -1;

      if (isNew) return [...prev, newItem];
      else {
        const newArr = [...prev];
        newArr.splice(existingIndex, 1, newItem);
        return newArr;
      }
    },
    update: (prev: T[] = []) => {
      const result = [...prev];
      result.splice(
        result.findIndex((item) => item && item?.id === newItem?.id),
        1,
        newItem
      );
      return result;
    },
    delete: (prev: T[] = []) => {
      return [...prev].filter((item) => item.id !== newItem.id);
    },
    create: (prev: T[] = []) => {
      return [...prev, newItem];
    },
  };

  return handlers[query];
};
