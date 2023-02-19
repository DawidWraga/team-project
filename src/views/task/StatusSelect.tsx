import { AsyncSelect } from 'chakra-react-select';
import { keepFloatingLabelActive } from 'utils/keepFloatingLabelActive';
import { RefAttributes, useEffect, useRef } from 'react';
import type { GroupBase, Props as SelectProps, SelectInstance } from 'react-select';
import { InputProps as ChakraInputProps } from '@chakra-ui/react';
import { z } from 'zod';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';
import { useCurrentProject } from 'lib-client/hooks/useCurrentProject';

export const optionSchema = z.object({
  label: z.string(),
  value: z.number(),
});

type Option = z.infer<typeof optionSchema>;
type IsMulti = false;
type Group = GroupBase<Option>;

export function formatStatusOptions(options: any[]) {
  if (!options || options.length === 0) return [];
  return options.map(formatStatusOption);
}

export function formatStatusOption(option: any) {
  return {
    label: option.label,
    value: option.value || option.id,
  };
}

export function StatusSelect({
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
  const { data: project, isLoading, isSuccess } = useCurrentProject();

  const selectRef = useRef<any>(null);
  const options = project?.id && formatStatusOptions(project?.statuses);
  useEffect(() => {
    if (!field || !field.value || !selectRef.current) return;
    const keepActive = field?.value;
    const ref = selectRef.current.controlRef;
    keepFloatingLabelActive(ref, keepActive);
  }, [field?.value]);

  return (
    <AsyncSelect<any, IsMulti, Group>
      defaultOptions={options}
      {...field}
      ref={selectRef}
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
