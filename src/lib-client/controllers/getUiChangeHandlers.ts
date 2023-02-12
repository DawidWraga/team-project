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
    changeUiType?: 'array' | 'object';
  }) => {
    const { query, newItem, changeUiKey, changeUiType } = {
      changeUiType: 'array' as const,
      ...hookProps,
      ...props,
    };
    // console.log({ query, newItem, changeUiKey });
    const item = { ...newItem };
    if (!query || !changeUiKey)
      throw new Error(
        'must input "query" AND "changeUIKey" args into changeQueryState OR useChangeQueryState.'
      );

    // prevent refetches to stop them from overwriting optimistic update
    await queryClient.cancelQueries({ queryKey: changeUiKey });

    // Snapshot the previous value
    const previousState = queryClient.getQueryData(changeUiKey!) || [];

    if (changeUiType === 'array' && !item.id) (item as any).id = createItemId();
    // Optimistically update to the new value

    queryClient.setQueryData(
      changeUiKey!,
      getUiChangeHandler(item, changeUiType || 'array')[query]
    );

    // Return a context object with the snapshotted value
    return { previousState };
  };

  return { changeQueryState };
}

export const getUiChangeHandler = <T extends Record<'id' | any, any>>(
  newItem: T,
  changeUiType?: 'array' | 'object'
) => {
  if (changeUiType === 'array')
    return {
      upsert: (prev: T[] = []) => {
        const prevIndex = prev.findIndex((it) => it?.id == newItem?.id);
        const prevItem = prev[prevIndex];
        const isNew = prevIndex === -1;

        if (isNew) return [...prev, { ...prevItem, ...newItem }];
        else {
          const newArr = [...prev];
          newArr.splice(prevIndex, 1, { ...prevItem, ...newItem });
          console.log({ new: newArr[prevIndex], prevItem, newItem });
          return newArr;
        }
      },
      update: (prev: T[] = []) => {
        const result = [...prev];
        const prevIndex = result.findIndex((item) => item && item?.id === newItem?.id);
        const prevItem = result[prevIndex];
        result.splice(prevIndex, 1, { ...prevItem, ...newItem });
        return result;
      },
      delete: (prev: T[] = []) => {
        return [...prev].filter((item) => item.id !== newItem.id);
      },
      create: (prev: T[] = []) => {
        return [...prev, newItem];
      },
    };

  if (changeUiType === 'object')
    return {
      update: (prev: Record<any, any>) => {
        return {
          ...(prev && prev),
          ...newItem,
        };
      },
    };

  if (changeUiType === 'reorder')
    return {
      update: {},
    };
};
