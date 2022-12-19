import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
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
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as CharkaInputProps,
  Text,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { MdSend } from 'react-icons/md';
import { toast } from 'react-toastify';

export interface IFieldAndFieldState<TFieldValues extends FieldValues = FieldValues> {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  fieldState: ControllerFieldState;
}

interface IFormProps<TFieldValues> extends Omit<BoxProps, 'onSubmit'> {
  children: React.ReactNode;
  onSubmit?: (data: TFieldValues) => any;
  onServerSuccess?: (data: any) => void;
  onServerError?: (message: string) => void;
  serverErrorFeedbackType?: 'toast' | 'text' | null;
}

export interface ICreateInputProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  required?: boolean;
  label?: string;
  placeholder?: string;
  helperText?: string;
  type?: string;
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
  SubmitBtn: (props: ButtonProps) => JSX.Element;
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

  const Form = useCallback((props: IFormProps<TFieldValues>) => {
    let {
      children,
      onSubmit,
      onServerSuccess,
      onServerError,
      serverErrorFeedbackType = 'text',
      ..._props
    } = props;
    if (!onSubmit) onSubmit = (data) => console.table(data);
    return (
      <Box
        as={'form'}
        bgColor={'#fff'}
        px="5"
        display="flex"
        flexDir="column"
        gap="4"
        autoComplete="off"
        noValidate
        py="1rem"
        onSubmit={obj.handleSubmit(async (data) => {
          try {
            const res = await onSubmit!(data);
            if (onServerSuccess) onServerSuccess(res);
            return res;
          } catch (e: any) {
            const message =
              e.response?.data?.cause || 'Something went wrong, please try again later';

            const type = serverErrorFeedbackType;
            console.log(message, type);

            if (type === 'text') obj.setError('server' as any, { message });
            if (type == 'toast') toast.error(message);
            if (onServerError) onServerError(message);
          }
        })}
        {..._props}
      >
        {children}
      </Box>
    );
  }, []);

  const SubmitBtn = useCallback(
    ({ children, sx, ...props }: ButtonProps) => {
      const { errors } = obj.formState;
      console.log(errors?.server?.message);
      return (
        <>
          <Button
            startIcon={<MdSend />}
            type="submit"
            textTransform={'capitalize'}
            variant="solid"
            colorScheme={'brand'}
            isLoading={obj.formState.isSubmitting}
            {...props}
          >
            {'submit' || children}
          </Button>
          {errors?.server && (
            <Text color="red.500">{errors?.server?.message as string}</Text>
          )}
        </>
      );
    },
    [obj.formState]
  );

  const Input = useCallback((props: ICreateInputProps<TFieldValues>) => {
    const {
      name,
      controllerProps,
      customInput,
      inputProps,
      label,
      placeholder,
      helperText,
      type,
    } = props;

    if (!!customInput && (!!inputProps || !!placeholder || !!type))
      console.warn(
        'If custom input is used, input props will not be applied.\n Must Place inputProps directly on component inside custominput.'
      );

    // derive required from zod schema
    // if schema not available, pressume required
    // can be overwritten with "required" prop
    const required = (schema as any).shape
      ? (schema as any)?.shape[name]?._def?.typeName !== 'ZodOptional'
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
                  type={type}
                  //transform input value into number if input type is number
                  {...(type === 'number' && {
                    onChange: (ev) => {
                      obj.setValue(name, Number(ev.target.value) as any);
                    },
                  })}
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
  }, []);

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

  return { ...obj, Form, Input, DebugPanel, SubmitBtn };
};
