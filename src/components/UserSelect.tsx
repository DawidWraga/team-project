import { Select, AsyncSelect } from 'chakra-react-select';
import { keepFloatingLabelActive } from 'utils/keepFloatingLabelActive';
import type { RefAttributes } from 'react';
import type { GroupBase, Props as SelectProps, SelectInstance } from 'react-select';
import { InputProps as ChakraInputProps } from '@chakra-ui/react';
import { z } from 'zod';
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { userController } from 'lib-client/controllers';

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
  } = userController.useQuery('findMany', {
    staleTime: 60 * 60 * 100000,
    // initialData: userDummyData as any,
    prismaProps: {
      select: {
        fullName: true,
        id: true,
      },
    },
  });

  const options = users?.map((user) => ({ label: user.fullName, value: user.id }));

  return (
    <AsyncSelect<any, IsMulti, Group>
      defaultOptions={isSuccess ? options : userDummyData}
      {...field}
      onBlur={(ev) => {
        const keepActive = field.value && (field.value as any).length > 0;
        keepFloatingLabelActive(ev.target, keepActive);
      }}
      isMulti
      // _loading={isLoading}
      chakraStyles={{
        container: (prev) => ({
          ...prev,
          shadow: defaults?.shadow || '',
          borderColor: defaults?.borderColor || '',
        }),
        inputContainer: (prev) => ({
          ...prev,
          h: '40px',
          alignItems: 'center',
          justiftContent: 'center',
        }),
        menu: (prev) => ({
          ...prev,
          zIndex: 9999,
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
