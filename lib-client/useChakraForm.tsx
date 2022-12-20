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
  Heading as ChakraHeading,
  Text,
  HeadingProps,
  Flex,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { MdCheck, MdSend } from 'react-icons/md';
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
interface UseChakraFormReturn<TFieldValues extends FieldValues, TContext = any>
  extends UseFormReturn<TFieldValues, TContext> {
  Form: (props: IFormProps<TFieldValues>) => JSX.Element;
  Input: (props: ICreateInputProps<TFieldValues>) => JSX.Element;
  DebugPanel: () => JSX.Element;
  SubmitBtn: (props: ButtonProps) => JSX.Element;
  Heading: (props: HeadingProps) => JSX.Element;
  isServerSuccess: boolean;
}

interface UseChakraFormProps<TFieldValues extends FieldValues, TContext = any>
  extends UseFormProps<TFieldValues, TContext> {
  schema: ZodType<TFieldValues>;
}

export const useChakraForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props: UseChakraFormProps<TFieldValues, TContext>
): UseChakraFormReturn<TFieldValues, TContext> => {
  const { schema, ...otherProps } = props;
  const [isServerSuccess, setIsServerSuccess] = useState(false);

  // ======== Call default useForm hook
  const obj: UseFormReturn<TFieldValues, TContext> = useForm<TFieldValues>({
    ...otherProps,
    resolver: zodResolver(schema),
  } as UseFormProps<TFieldValues, TContext>);

  // reset server success state if user changes any inputs
  useEffect(() => {
    if (isServerSuccess) {
      setIsServerSuccess(false);
    }
  }, [obj.formState.isValidating]);

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
        display="flex"
        flexDir="column"
        gap="4"
        autoComplete="off"
        noValidate
        py="1rem"
        width="100%"
        maxW="480px"
        px={{ base: 3, sm: 6, lg: 8 }}
        onSubmit={obj.handleSubmit(async (data) => {
          try {
            const res = await onSubmit!(data);
            setIsServerSuccess(true);
            if (onServerSuccess) onServerSuccess(res);
            return res;
          } catch (e: any) {
            const message =
              e.response?.data?.cause || 'Something went wrong, please try again later';

            const type = serverErrorFeedbackType;

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
    ({ children, sx, leftIcon, ...props }: ButtonProps) => {
      const { errors } = obj.formState;
      return (
        <Flex flexDir={'column'} gap={2.5} mt="2">
          <Button
            leftIcon={
              isServerSuccess ? <MdCheck fontSize="1.5rem" /> : leftIcon || <MdSend />
            }
            type="submit"
            textTransform={'capitalize'}
            variant="solid"
            colorScheme={isServerSuccess ? 'green' : 'brand'}
            isLoading={obj.formState.isSubmitting}
            {...props}
          >
            {isServerSuccess ? 'Success!' : children || 'submit'}
          </Button>
          {errors?.server && (
            <Text color="red.500">{errors?.server?.message as string}</Text>
          )}
        </Flex>
      );
    },
    [obj.formState, isServerSuccess]
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
                      obj.setValue(name, Number(ev.target.value) as any, {
                        shouldValidate: true,
                      });
                    },
                  })}
                  borderColor={'blackAlpha.300'}
                  bgColor="pale.main"
                  shadow={'sm'}
                  w="100%"
                  {...(inputProps && inputProps({ field, fieldState }))}
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

  const Heading = useCallback(({ children, ...props }: HeadingProps) => {
    return (
      <ChakraHeading
        fontSize={[26, 28, 30]}
        wordBreak="revert"
        mx="auto"
        textAlign={'center'}
        fontWeight="semibold"
        mb="2"
        {...props}
      >
        {children}
      </ChakraHeading>
    );
  }, []);

  return { ...obj, isServerSuccess, Form, Input, DebugPanel, SubmitBtn, Heading };
};
