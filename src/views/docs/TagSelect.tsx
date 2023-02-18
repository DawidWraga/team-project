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

export const tagOptionSchema = z.object({
  label: z.string(),
  value: z.number(),
});

export const multiTagOptionsSchema = tagOptionSchema.array().min(1);

type Option = z.infer<typeof tagOptionSchema>;
type IsMulti = true;
type Group = GroupBase<Option>;

export function formatTagOptions(tags: User[] | CompleteUser[] = []) {
  if (!tags || tags.length === 0) return [];
  return tags.map((tag: any) => ({
    label: tag.label || tag.fullName,
    value: tag.value || tag.id,
  }));
}

export function TagSelect({
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
    data: tags,
    isLoading,
    isSuccess,
  } = controller.useQuery({
    model: 'tag',
    query: 'findMany',
    staleTime: 60 * 60 * 100000,
  });

  const selectRef = useRef<any>(null);
  const options = formatTagOptions(tags);
  useEffect(() => {
    if (!field || !field.value || !selectRef.current) return;
    const keepActive = field?.value && (field?.value as any).length > 0;
    const ref = selectRef.current.controlRef;
    keepFloatingLabelActive(ref, keepActive);
  }, [field?.value]);

  return (
    <AsyncSelect<any, IsMulti, Group>
      defaultOptions={options}
      // defaultOptions={isSuccess ? options : userDummyData}
      {...field}
      ref={selectRef}
      isMulti
      placeholder="select"
      chakraStyles={{
        container: (prev) => ({
          ...prev,
          shadow: defaults?.shadow || '',
          borderColor: 'red',
          minW: '75px',
        }),
        inputContainer: (prev) => ({
          ...prev,
          // h: '40px',
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
