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
import { AnyZodObject, ZodType, ZodTypeDef, z } from 'zod';
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
  FormControlProps,
  FormLabelProps,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { MdCheck, MdSend } from 'react-icons/md';
import { toast } from 'react-toastify';
import moment from 'moment';
import { PasswordInput } from 'components/PasswordInput';
import { FormHeading } from 'components/FormHeading';
import { UserSelect } from 'components/UserSelect';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';

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
  formControlProps?: FormControlProps;
  controllerProps?: Omit<UseControllerProps, 'name' | 'control' | 'render'>;
  inputProps?: (props: IFieldAndFieldState<TFieldValues>) => ChakraInputProps;
  customInput?: (
    props: { defaults: ChakraInputProps } & IFieldAndFieldState<TFieldValues>
  ) => JSX.Element;
  hideLabel?: boolean;
  labelProps?: FormLabelProps;
}

export interface IInputListProps<TFieldValues extends FieldValues = FieldValues> {
  name: string;
  inputs: (names: Record<any, any>) => JSX.Element;
}

interface UpdateSchema<TFieldValues extends FieldValues> {
  set: React.Dispatch<
    React.SetStateAction<ZodType<TFieldValues, ZodTypeDef, TFieldValues>>
  >;
  addObj: (key: string, schema: AnyZodObject | Record<any, any>) => Record<any, any>;
  remove: (keys: string[]) => void;
}
// ========== RETURN TYPE
interface UseChakraFormReturn<TFieldValues extends FieldValues, TContext = any>
  extends UseFormReturn<TFieldValues, TContext> {
  Form: (props: IFormProps<TFieldValues>) => JSX.Element;
  Input: (props: ICreateInputProps<TFieldValues>) => JSX.Element;
  InputList: (props: IInputListProps<TFieldValues>) => JSX.Element;
  DebugPanel: () => JSX.Element;
  SubmitBtn: (props: ButtonProps) => JSX.Element;
  Heading: (props: HeadingProps) => JSX.Element;
  isServerSuccess: boolean;
  // setSchema: React.Dispatch<React.SetStateAction<z.ZodObject<TFieldValues>>>;
  updateSchema: UpdateSchema<TFieldValues>;
}

interface UseChakraFormProps<TFieldValues extends FieldValues, TContext = any>
  extends UseFormProps<TFieldValues, TContext> {
  schema: ZodType<TFieldValues>;
  logDataBeforeSubmit?: boolean;
}

const addPrefixToObject = (obj: Record<any, any>, prefix: string) => {
  const entries = Object.entries(obj);
  const mapped = entries.map(([k, v]) => [`${prefix}_${k}`, v]);
  return Object.fromEntries(mapped);
};
const addSuffixToObject = (obj: Record<any, any>, suffix: string | number) => {
  const entries = Object.entries(obj);
  const mapped = entries.map(([k, v]) => [`${k.split('-')[0]}-${suffix}`, v]);
  return Object.fromEntries(mapped);
};

export const useChakraForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props: UseChakraFormProps<TFieldValues, TContext>
): UseChakraFormReturn<TFieldValues, TContext> => {
  const { schema, logDataBeforeSubmit, ...otherProps } = props;
  const [isServerSuccess, setIsServerSuccess] = useState(false);

  const [dynamicSchema, updateDynamicSchema] = useDynamicSchema(schema);

  // ======== Call default useForm hook
  const useFormReturn: UseFormReturn<TFieldValues, TContext> = useForm<TFieldValues>({
    ...otherProps,
    resolver: zodResolver(dynamicSchema),
  } as UseFormProps<TFieldValues, TContext>);

  // reset server success state if user changes any inputs
  useEffect(() => {
    if (isServerSuccess) {
      setIsServerSuccess(false);
    }
  }, [useFormReturn.formState.isValidating]);

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
        onSubmit={useFormReturn.handleSubmit(async (data) => {
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

            if (type === 'text') useFormReturn.setError('server' as any, { message });
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
      const { errors } = useFormReturn.formState;
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
            isLoading={useFormReturn.formState.isSubmitting}
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
    [useFormReturn.formState, isServerSuccess]
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
        hideLabel,
        formControlProps,
        labelProps,
      } = props;

      const defaultLabel = name.replace(/([A-Z])/g, ' $1').replace('_', ' ');

      label ??= defaultLabel;
      if (type === 'password') hideLabel = true;

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
          control={useFormReturn.control}
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
                useFormReturn.setValue(name, Number(ev.target.value) as any, {
                  shouldValidate: true,
                });
              };

            if (type === 'date') {
              defaults.onChange = (ev) => {
                useFormReturn.setValue(name, new Date(ev.target.value) as any, {
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
                {...formControlProps}
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

                  if (type === 'userSelect') {
                    console.log('useChakraForm', field, defaults);
                    return <UserSelect field={field} defaults={defaults} />;
                  }

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
                {!hideLabel && (
                  <FormLabel textTransform={'capitalize'} {...labelProps}>
                    {label}
                  </FormLabel>
                )}
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            );
          }}
        />
      );
    },
    [useFormReturn.reset]
  );

  const InputList = (props: IInputListProps<TFieldValues>) => {
    const { name, inputs } = props;

    const schemaKeys = Object.keys((dynamicSchema as any).shape);
    const relevantKeys = schemaKeys.filter((k) => k.includes(name));
    const newKeys = formatObjectKeys(relevantKeys);

    return (
      <>
        {newKeys &&
          newKeys.map((keysObject) => {
            return (
              <div key={Object.values(keysObject).join('_')}>{inputs(keysObject)}</div>
            );
          })}
      </>
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
        <Button onClick={() => console.log(useFormReturn.getValues())}>values</Button>
        <Button
          onClick={() => console.log(JSON.stringify(useFormReturn.formState.errors))}
        >
          errors
        </Button>
        <Button onClick={() => useFormReturn.reset()}>reset</Button>
        <Button onClick={() => console.log((dynamicSchema as any).keyof()._def.values)}>
          schema keys
        </Button>
      </ButtonGroup>
    );
  };

  const Heading = useCallback(({ children, ...props }: HeadingProps) => {
    return <FormHeading {...props}>{children}</FormHeading>;
  }, []);

  return {
    ...useFormReturn,
    isServerSuccess,
    Form,
    Input,
    DebugPanel,
    SubmitBtn,
    Heading,
    InputList,
    updateSchema: updateDynamicSchema as any,
  };
};

function useDynamicSchema(schema) {
  const [dynamicSchema, setDynamicSchema] = useState(schema);

  const updateSchema = {
    set: setDynamicSchema,
    addObj: (key: string, schema: AnyZodObject | Record<any, any>) => {
      let newSchema: Record<any, any> = schema.shape ? schema.shape : schema;

      newSchema = addPrefixToObject(newSchema, key);

      setDynamicSchema((prev: any) => {
        const prevKeys = Object.keys(prev.shape);
        const relatedKeys = prevKeys.filter((k) => k.split('_')[0].includes(key));

        let id: string | number = '0';
        if (relatedKeys.length) {
          const relatedIds = relatedKeys.map((k) => {
            return Number(k.split('-')[1]);
          });
          const maxId = Math.max(...relatedIds);
          id = maxId + 1;
        }
        newSchema = addSuffixToObject(newSchema, id);
        const extended = prev.extend(newSchema);
        return extended;
      });
      return newSchema;
    },
    remove: (keys: string[]) => {
      setDynamicSchema((prev) => {
        // const sch = z.object({ test: z.string() });
        const mask = Object.fromEntries(keys.map((k) => [k, true]));
        // sch.omit(m);
        return prev.omit(mask);

        // prev.
      });
    },
  };

  return [dynamicSchema, updateSchema] as const;
}

export const getNameFromObjectKey = (objectKey: string) =>
  objectKey.split('-')[0].split('_')[1];

function formatObjectKeys(objectKeys: string[]) {
  const arr = objectKeys.reduce((acc, currentKey) => {
    const id = currentKey.split('-')[1];
    const name = getNameFromObjectKey(currentKey);
    acc[id] = {
      ...(acc[id] && acc[id]),
      [name]: currentKey,
    };

    return acc;
  }, {} as Record<string, any>);
  return Object.values(arr);
}

// export function focusOnSchema(schema: Record<any, any>, target: string) {
//   const keys = Object.keys(schema);
//   const key = keys.find((key) => key.includes(target));

//   setTimeoutPromise(100).then(() => {
//     const ele: HTMLInputElement = document.querySelector(`[name=${key}]`);

//     const previewElem = ele.querySelector('.chakra-editable__preview');
//     const inputElem = ele.querySelector('.chakra-editable__input');

//     previewElem.setAttribute('hidden', '');
//     // ele.focus();
//     inputElem.classList.add('focus-visible');
//     inputElem.removeAttribute('hidden');
//     // ele.outerHTML += 'testing';
//   });
// }
