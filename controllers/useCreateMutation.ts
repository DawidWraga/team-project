import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from 'react-query';

export interface IUseCreateMutationProps<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  invalidateKeys?: string[];
}

export const useCreateMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: IUseCreateMutationProps<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> => {
  const queryClient = useQueryClient();

  const mutation = useMutation<TData, TError, TVariables, TContext>({
    ...options,
    onSuccess: async (data, variables, context) => {
      if (options?.invalidateKeys) {
        await queryClient.invalidateQueries(options?.invalidateKeys!);
      }
      if (options?.onSuccess) options?.onSuccess(data, variables, context);
    },
  });

  return mutation;
};
