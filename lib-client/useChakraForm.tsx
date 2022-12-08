import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  Field,
  FieldValues,
  Path,
  UseControllerProps,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodType } from 'zod';
import {
  Box,
  BoxProps,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as CharkaInputProps,
} from '@chakra-ui/react';

export interface IFieldAndFieldState<TFieldValues extends FieldValues = FieldValues> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  fieldState: ControllerFieldState;
}

interface IFormProps<TFieldValues> extends Omit<BoxProps, 'onSubmit'> {
  children: React.ReactNode;
  onSubmit?: (data: TFieldValues) => any;
  submitLabel?: string;
}

export interface ICreateInputProps<TFieldValues extends FieldValues = FieldValues> {
  name: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
  helperText?: string;
  controllerProps?: Omit<UseControllerProps, 'name' | 'control' | 'render'>;
  inputProps?: (props: IFieldAndFieldState<TFieldValues>) => CharkaInputProps;
  customInput?: (props: IFieldAndFieldState<TFieldValues>) => JSX.Element;
}

// ========== RETURN TYPE
interface UseMuiFormReturn<TFieldValues extends FieldValues, TContext = any>
  extends UseFormReturn<TFieldValues, TContext> {
  Form: (props: IFormProps<TFieldValues>) => JSX.Element;
  Input: (props: ICreateInputProps<TFieldValues>) => JSX.Element;
  DebugPanel: () => JSX.Element;
}

interface UseMuiFormProps<TFieldValues extends FieldValues, TContext = any>
  extends UseFormProps<TFieldValues, TContext> {
  schema: ZodType<TFieldValues>;
}

// !=========WARNING=======
// destrucuring formState: {errors } from useMuiForm will result in whole form rerender every time the error state changes. Causes inputs to lose focus and performance issues. instead, use formState from renderInput props (Input prop)

export const useChakraForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props: UseMuiFormProps<TFieldValues, TContext>
): UseMuiFormReturn<TFieldValues, TContext> => {
  // ======== DEFAULT USEFORM HOOK
  const { schema, ...otherProps } = props;

  const obj: UseFormReturn<TFieldValues, TContext> = useForm<TFieldValues>({
    ...otherProps,
    resolver: zodResolver(schema),
  } as UseFormProps<TFieldValues, TContext>);

  const Form = (props: IFormProps<TFieldValues>) => {
    let { children, onSubmit, submitLabel } = props;
    if (!onSubmit) onSubmit = (data) => console.table(data);
    return (
      <Box
        as={'form'}
        maxW="50vw"
        mx="auto"
        bgColor={'#fff'}
        px="5"
        display="flex"
        flexDir="column"
        gap="5"
        onSubmit={obj.handleSubmit(onSubmit)}
        noValidate
        py="1rem"
      >
        {children}
        <Button
          type="submit"
          textTransform={'capitalize'}
          variant="solid"
          colorScheme={'brand'}
        >
          {submitLabel || 'submit'}
        </Button>
      </Box>
    );
  };

  const Input = (props: ICreateInputProps<TFieldValues>) => {
    const {
      name,
      controllerProps,
      customInput,
      inputProps,
      label,
      placeholder,
      helperText,
    } = props;

    if (!!customInput && (!!inputProps || !!placeholder))
      console.warn(
        'If custom input is used, input props will not be applied.\n Must Place inputProps directly on component inside custominput.'
      );

    // derive required from zod schema
    // if schema not available, pressume required
    const required = (schema as any).shape
      ? (schema as any).shape[name]._def.typeName !== 'ZodOptional'
      : true;

    return (
      <Controller
        name={name as Path<TFieldValues>}
        key={name}
        control={obj.control}
        {...controllerProps}
        render={({ field, fieldState }) => {
          const { error } = fieldState;
          // prevent uncontrolled => controlled error messages by defaulting undefined value to empty string
          const processedField = {
            ...field,
            value: field.value || '',
          } as typeof field;

          return (
            <FormControl isRequired={required} isInvalid={Boolean(error)}>
              <FormLabel textTransform={'capitalize'}>
                {label || field.name.replace(/([A-Z])/g, ' $1')}
              </FormLabel>
              {!!customInput ? (
                customInput({ field: processedField, fieldState })
              ) : (
                <ChakraInput
                  {...processedField}
                  placeholder={placeholder}
                  {...inputProps}
                />
              )}
              {helperText}
              {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
          );


        }}
      />
    );
  };

  const DebugPanel = () => {
    return (
      <ButtonGroup
        gap="1"
        display="flex"
        flexDir="row"
        position="fixed"
        zIndex="999"
        bottom={10}
      >
        <Button onClick={() => console.log(obj.getValues())}>values</Button>
        <Button onClick={() => console.log(JSON.stringify(obj.formState.errors))}>
          errors
        </Button>
        <Button onClick={() => obj.reset()}>reset</Button>
      </ButtonGroup>
    );
  };

  return { ...obj, Form, Input, DebugPanel };
};
