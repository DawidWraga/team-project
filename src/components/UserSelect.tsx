import { AsyncSelect } from 'chakra-react-select';
import { keepFloatingLabelActive } from 'utils/keepFloatingLabelActive';
import { RefAttributes, useEffect, useRef, useState } from 'react';
import type { GroupBase, Props as SelectProps, SelectInstance } from 'react-select';
import { InputProps as ChakraInputProps } from '@chakra-ui/react';
import { z } from 'zod';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';

import { controller } from 'lib-client/controllers';
import { ChakraFormWrapper } from 'lib-client/hooks/useChakraForm';
import { User } from '@prisma/client';
import { CompleteUser } from 'prisma/zod';
import { useDebounce } from 'lib-client/hooks/useDebouce';
import { PrismaModelNames } from 'lib-server/prisma';
import { ICustomUseMutationOptions } from 'lib-client/controllers/types/Controller';
import { arrayIsEqual } from 'utils/arrayIsEqual';

export const userOptionSchema = z.object({
  label: z.string(),
  value: z.number(),
});

export const multiUserOptionsSchema = userOptionSchema.array().min(1);

type Option = z.infer<typeof userOptionSchema>;
type IsMulti = true;
type Group = GroupBase<Option>;

const userDummyData: Option[] = [
  {
    label: 'steve',
    value: 1,
  },
  {
    label: 'bob',
    value: 2,
  },
  {
    label: 'me',
    value: 3,
  },
];

export function formatUserOptions(users: User[] | CompleteUser[] = []) {
  if (!users || users.length === 0) return [];
  return users.map((user: any) => ({
    label: user.label || user.fullName,
    value: user.value || user.id,
  }));
}

export function UserSelect({
  defaults,
  field,
  fieldState,
  ...selectProps
}: SelectProps<Option, IsMulti, Group> &
  RefAttributes<SelectInstance<Option, IsMulti, Group>> & {
    defaults: ChakraInputProps;
    field: ControllerRenderProps<any, any>;
    fieldState?: ControllerFieldState;
  }) {
  const {
    data: users,
    isLoading,
    isSuccess,
  } = controller.useQuery({
    model: 'user',
    query: 'findMany',
    staleTime: 60 * 60 * 100000,
    // initialData: userDummyData as any,
    prismaProps: {
      select: {
        fullName: true,
        id: true,
      },
    },
  });

  const selectRef = useRef<any>(null);
  const options = formatUserOptions(users);
  useEffect(() => {
    if (!field || !field.value || !selectRef.current) return;
    const keepActive = field?.value && (field?.value as any).length > 0;
    const ref = selectRef.current.controlRef;
    keepFloatingLabelActive(ref, keepActive);
  }, [field?.value]);

  return (
    <AsyncSelect<any, IsMulti, Group>
      defaultOptions={isSuccess ? options : userDummyData}
      {...field}
      ref={selectRef}
      isMulti
      chakraStyles={{
        container: (prev) => ({
          ...prev,
          shadow: defaults?.shadow || '',
          borderColor: defaults?.borderColor || '',
          minW: '75px',
        }),
        inputContainer: (prev) => ({
          ...prev,
          h: '40px',
          alignItems: 'center',
          justiftContent: 'center',
          minW: '75px',
        }),
        menu: (prev) => ({
          ...prev,
          zIndex: 9999,
          minW: '75px',
        }),
      }}
      isLoading={isLoading}
      loadOptions={(inputValue, callback) => {
        if (!inputValue || inputValue.length < 1) return callback(options);

        const values = options.filter((option) =>
          option.label.toLowerCase().includes(inputValue?.toLowerCase())
        );
        return callback(values || options);
      }}
      {...selectProps}
    />
  );
}

interface IUserSelectFormProps {
  defaultUsers?: User[];
  model: PrismaModelNames;
  updateId: number;
  modelFieldName: string;
  useMutationProps?: Partial<ICustomUseMutationOptions<any>>;
  saveChangesDependancies?: any[];
}

export function UpdateUserForm(props: IUserSelectFormProps) {
  const {
    model,
    updateId,
    modelFieldName,
    defaultUsers,
    useMutationProps,
    saveChangesDependancies,
  } = props;

  const defaultOptions = formatUserOptions(defaultUsers);

  return (
    <ChakraFormWrapper
      schema={z.object({
        users: multiUserOptionsSchema,
      })}
      defaultValues={{
        users: defaultOptions,
      }}
    >
      {({ Form, Input, watch }) => {
        const users = watch('users');
        const { mutateAsync } = controller.useMutation({
          model,
          query: 'update',
          ...useMutationProps,
        });

        const [prevUsers, setPrevUsers] = useState(defaultOptions);

        useEffect(() => {
          const prevIds = prevUsers?.map((user) => user.value);
          const newIds = users?.map((user) => user.value);
          const noDifference = arrayIsEqual(prevIds, newIds);

          if (noDifference) return;

          const formattedUsers = users?.map((user) => ({ id: user.value }));
          const data = { id: updateId, [modelFieldName]: formattedUsers };
          mutateAsync(data).then(() => setPrevUsers(users as any));
        }, [useDebounce(users, 2000), ...(saveChangesDependancies || [])]);
        return (
          <Form>
            <Input
              hideLabel={true}
              name="users"
              customInput={(props) => <UserSelect {...props} />}
            />
          </Form>
        );
      }}
    </ChakraFormWrapper>
  );
}
