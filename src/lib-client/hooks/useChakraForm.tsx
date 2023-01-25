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
  InputProps as ChakraInputProps,
  Heading as ChakraHeading,
  Text,
  HeadingProps,
  Flex,
  FormHelperText,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { MdCheck, MdSend } from 'react-icons/md';
import { toast } from 'react-toastify';
import moment from 'moment';
import { PasswordInput } from 'components/PasswordInput';
import { FormHeading } from 'components/FormHeading';

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
  inputProps?: (props: IFieldAndFieldState<TFieldValues>) => ChakraInputProps;
  customInput?: (
    props: { defaults: ChakraInputProps } & IFieldAndFieldState<TFieldValues>
  ) => JSX.Element;
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
  logDataBeforeSubmit?: boolean;
}

export const useChakraForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props: UseChakraFormProps<TFieldValues, TContext>
): UseChakraFormReturn<TFieldValues, TContext> => {
  const { schema, logDataBeforeSubmit, ...otherProps } = props;
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
        autoComplete="off"
        noValidate
        sx={{
          w: '100%',
          bgColor: '#fff',
          flexDir: 'column',
          gap: '6',
          display: 'flex',
          py: '1rem',
          width: '100%',
          maxW: '480px',
          px: { base: 3, sm: 6, lg: 8 },
          mx: 'auto',
          '& .chakra-form-control:not(:first-of-type)': {
            mt: 1,
            // bg,
          },
        }}
        onSubmit={obj.handleSubmit(async (data) => {
          try {
            if (logDataBeforeSubmit) {
              console.log('LOG Form submit data: ', data);
            }
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
            fontWeight={500}
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

  const Input = useCallback(
    (props: ICreateInputProps<TFieldValues>) => {
      let {
        name,
        controllerProps,
        customInput,
        inputProps,
        label,
        placeholder,
        helperText,
        type,
      } = props;

      const defaultLabel = name.replace(/([A-Z])/g, ' $1').replace('_', ' ');

      label ??= defaultLabel;

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

            const defaults: ChakraInputProps = {
              placeholder: ' ',
              type,
              borderColor: 'blackAlpha.500',
              // bgColor: 'hsl(204, 20%,97%)',
              shadow: 'sm',
              w: '100%',
            };

            //transform input value into expected value
            if (type === 'number')
              defaults.onChange = (ev: any) => {
                obj.setValue(name, Number(ev.target.value) as any, {
                  shouldValidate: true,
                });
              };

            if (type === 'date') {
              defaults.onChange = (ev) => {
                obj.setValue(name, new Date(ev.target.value) as any, {
                  shouldValidate: true,
                });
              };
              if (field.value) {
                defaults.value = moment(field.value).format('yyyy-MM-DD');
              }
            }

            return (
              <FormControl
                variant={'floating'}
                isRequired={required}
                isInvalid={Boolean(error)}
              >
                {(() => {
                  {
                    /* render custom inputs eg switch, slider etc */
                  }
                  if (Boolean(customInput)) {
                    return customInput({ field: processedField, fieldState, defaults });
                  }

                  // custom password input, including text hide toggle
                  if (type === 'password')
                    return (
                      <PasswordInput
                        {...processedField}
                        {...defaults}
                        label={label}
                        {...(inputProps && inputProps({ field, fieldState }))}
                      />
                    );

                  // default = render Input from chakra (eg text, number, date, etc)
                  return (
                    <ChakraInput
                      {...processedField}
                      {...defaults}
                      {...(inputProps && inputProps({ field, fieldState }))}
                    />
                  );
                })()}
                {/* for floating label selectors to work, label elem must be directly below input elem. Password returns input group therefore must place form label *inside* the Inputgroup */}
                {type !== 'password' && (
                  <FormLabel textTransform={'capitalize'}>{label}</FormLabel>
                )}
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            );
          }}
        />
      );
    },
    [obj.reset]
  );

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
    return <FormHeading {...props}>{children}</FormHeading>;
  }, []);

  return { ...obj, isServerSuccess, Form, Input, DebugPanel, SubmitBtn, Heading };
};
