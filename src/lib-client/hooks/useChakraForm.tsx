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
import { AnyZodObject, ZodType, ZodTypeDef } from 'zod';
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
  Text,
  HeadingProps,
  Flex,
  FormHelperText,
  FormControlProps,
  FormLabelProps,
  IconButton,
  IconButtonProps,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MdCheck, MdSave, MdSend } from 'react-icons/md';
import { toast } from 'react-toastify';
import moment from 'moment';
import { PasswordInput } from 'components/PasswordInput';
import { FormHeading } from 'components/FormHeading';
import {
  formatDynamicSchemaData,
  getSchemaName,
  groupSchemaNames,
  parseSchemaName,
  schemaObjectToSchemaNames,
  useDynamicSchema,
} from 'lib-client/hooks/useDynamicSchema';
import { objectMap } from 'utils/objectMap';
import { formatUserOptions } from 'components/UserSelect';
import { getObjectDifference } from 'utils/getObjectDifference';
import { MinusIcon } from '@chakra-ui/icons';
import { isDevEnv } from 'utils/isDevEnv';

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
  inputs: (
    names: Record<any, any>,
    utils: {
      removeAll: () => void;
      RemoveButton: (props: Omit<IconButtonProps, 'aria-label'>) => JSX.Element;
    }
  ) => JSX.Element;
  onChange?: (items: any[]) => any;
  ConditionalWrapper?: (props: { children: React.ReactNode }) => JSX.Element;
}

interface UpdateSchema<TFieldValues extends FieldValues> {
  set: React.Dispatch<
    React.SetStateAction<ZodType<TFieldValues, ZodTypeDef, TFieldValues>>
  >;
  addObj: (key: string, schema?: AnyZodObject | Record<any, any>) => Record<any, any>;
  remove: (keys: string[]) => void;
}
// ========== RETURN TYPE
interface UseChakraFormReturn<TFieldValues extends FieldValues, TContext = any>
  extends UseFormReturn<TFieldValues, TContext> {
  Form: (props: IFormProps<TFieldValues>) => JSX.Element;
  Input: (props: ICreateInputProps<TFieldValues>) => JSX.Element;
  InputList: (props: IInputListProps<TFieldValues>) => JSX.Element;
  DebugPanel: () => JSX.Element;
  SubmitBtn: (props: ButtonProps & { label?: string }) => JSX.Element;
  Heading: (props: HeadingProps) => JSX.Element;
  isServerSuccess: boolean;
  dynamicSchema: AnyZodObject;
  updateSchema: UpdateSchema<TFieldValues>;
  isEditing: boolean;
}

interface UseChakraFormProps<TFieldValues extends FieldValues, TContext = any>
  extends UseFormProps<TFieldValues, TContext> {
  schema: ZodType<TFieldValues>;
  logDataBeforeSubmit?: boolean;
  dynamicSchemaNamesToObj?: Record<string, AnyZodObject>;
  onChange?: (value: TFieldValues) => void;
  updateValues?: TFieldValues & { id?: number };
}

export const useChakraForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props: UseChakraFormProps<TFieldValues, TContext>
): UseChakraFormReturn<TFieldValues, TContext> => {
  let {
    schema,
    logDataBeforeSubmit,
    onChange,
    dynamicSchemaNamesToObj,
    updateValues,
    defaultValues,
    ...otherProps
  } = {
    dynamicSchemaNamesToObj: {},
    ...props,
  };

  const [isServerSuccess, setIsServerSuccess] = useState(false);

  const [dynamicSchema, updateDynamicSchema, useFormFormattedValues] = useDynamicSchema(
    schema,
    dynamicSchemaNamesToObj
  );

  // logic for update form
  const updateId = updateValues?.id;
  const isEditing = Boolean(updateId);

  const formattedUpdateValues = useFormFormattedValues(updateValues);
  const formattedDefaultValues = useFormFormattedValues(defaultValues);

  // ======== Call default useForm hook
  const useFormReturn: UseFormReturn<TFieldValues, TContext> = useForm<TFieldValues>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: isEditing ? formattedUpdateValues : formattedDefaultValues,
    ...otherProps,
  } as UseFormProps<TFieldValues, TContext>);

  // =======Subscribe to form state changes.=====
  useEffect(() => {
    let subscription: any;
    // If we have a callback function to call on change...
    if (onChange) {
      // Subscribe to form state changes.
      subscription = useFormReturn.watch(onChange as any);
    }
    // Unsubscribe when the component unmounts.
    return () => subscription?.unsubscribe();
  }, [useFormReturn, onChange]);

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
      sx,
      ...restProps
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
          },
          ...sx,
        }}
        onSubmit={useFormReturn.handleSubmit(async (data) => {
          // FORMAT DATA FOR UPDATE
          const schemaNames = Object.keys(dynamicSchemaNamesToObj);

          if (isEditing) {
            let diffData = getObjectDifference(formattedUpdateValues, data);
            const noChangesMade = Object.keys(diffData).length < 1;
            if (noChangesMade) {
              useFormReturn.setError('server' as any, {
                message: 'You must change a field before saving.',
              });
              return;
            }

            // ensure ID is passed to backend despite not being changed to enable id to be used in edit queries
            Object.entries(diffData).forEach(([schemaName, v]) => {
              const isDynamicSchema =
                schemaName.includes('&') && schemaName.includes('=');

              if (!isDynamicSchema) return;

              const schemaData = parseSchemaName(schemaName);
              if (schemaData.objectName === 'id') return;

              const schemaIdName = getSchemaName({ ...schemaData, property: 'id' });
              const existingId = diffData[schemaIdName];

              if (!existingId) {
                diffData[schemaIdName] = data[schemaIdName];
              }
            });

            data = { ...diffData, id: updateId } as any;
          }
          try {
            if (logDataBeforeSubmit) {
              console.log('LOG Form submit data: ', data);
            }

            // FORMAT DATA FOR DYNAMIC SCHEMA
            if (schemaNames.length) {
              data = formatDynamicSchemaData(data, schemaNames) as any;
            }

            const res = await onSubmit!(data);
            setIsServerSuccess(true);
            if (onServerSuccess) onServerSuccess(res);
            return res;
          } catch (e: any) {
            const message =
              e.response?.data?.cause || 'Something went wrong, please try again later.';

            const type = serverErrorFeedbackType;

            if (type === 'text') useFormReturn.setError('server' as any, { message });
            if (type == 'toast') toast.error(message);
            if (onServerError) onServerError(message);
          }
        })}
        {...restProps}
      >
        {children}
      </Box>
    );
  }, []);

  const SubmitBtn = useCallback(
    ({ children, sx, leftIcon, label, ...props }: ButtonProps & { label?: string }) => {
      const defaultLabel = isEditing ? 'Save Changes' : 'Create ' + label || '';
      const defaultIcon = isEditing ? <MdSave /> : <MdSend />;
      const { errors } = useFormReturn.formState;
      return (
        <Flex flexDir={'column'} gap={2.5} mt="2">
          <Button
            leftIcon={
              isServerSuccess ? <MdCheck fontSize="1.5rem" /> : leftIcon || defaultIcon
            }
            type="submit"
            textTransform={'capitalize'}
            variant="solid"
            fontWeight={500}
            colorScheme={isServerSuccess ? 'green' : 'brand'}
            isLoading={useFormReturn.formState.isSubmitting}
            {...props}
          >
            {isServerSuccess ? 'Success!' : children || defaultLabel}
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

      if (!name) return;
      const defaultLabel = name?.replace(/([A-Z])/g, ' $1').replace('_', ' ');

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
        <Controller<TFieldValues>
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
              placeholder: placeholder || ' ',
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
                id={name}
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

  const inputListDefaultProps = {
    ConditionalWrapper: ({ children }) => <>{children}</>,
  };

  const InputList = (props: IInputListProps<TFieldValues>) => {
    const { name, inputs, onChange, ConditionalWrapper } = {
      ...inputListDefaultProps,
      ...props,
    };

    // Get all the keys in the dynamicSchema object
    const schemaNames = Object.keys((dynamicSchema as any).shape);
    // Filter out the keys that don't contain the passed in name
    const relevantSchemas = schemaNames.filter((k) => k.includes(name));
    const groupedSchemas = groupSchemaNames(relevantSchemas);
    useEffect(() => {
      onChange && onChange(groupedSchemas);
    }, [groupedSchemas]);

    return (
      <>
        {groupedSchemas.length > 0 && (
          <ConditionalWrapper>
            {groupedSchemas.map((keysObject) => {
              // identify whether only key is Ids (hide if this is the case)
              const keysExceptId = Object.entries(keysObject).filter(
                ([k, v]) => k !== 'id'
              );
              const onlyId = keysExceptId.length === 0;

              // remove all relevant schema names, except id (needed for identifying in prisma delete query)
              const removeAll = useCallback(() => {
                const ids = Object.entries(keysObject)
                  .filter(([k, v]) => k !== 'id')
                  .map(([k, v]) => v);

                updateDynamicSchema.remove(ids);
              }, []);

              const RemoveButton = useCallback((props: any) => {
                return (
                  <IconButton
                    aria-label="remove item from input list"
                    icon={<MinusIcon fontSize="sm" />}
                    size="sm"
                    onClick={removeAll}
                    {...props}
                  />
                );
              }, []);

              const staticKey = useMemo(
                () =>
                  Object.values(keysObject).join('_') + new Date().getUTCMilliseconds(),
                []
              );

              return (
                <div
                  key={staticKey}
                  style={{
                    display: onlyId ? 'none' : 'unset',
                  }}
                >
                  {inputs(keysObject, { removeAll, RemoveButton })}
                </div>
              );
            })}
          </ConditionalWrapper>
        )}
      </>
    );
  };

  const DebugPanel = () => {
    return null;
    if (!isDevEnv) return null;
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
        <Button
          onClick={() =>
            dynamicSchema &&
            console.log(
              ((dynamicSchema as any)?.keyof &&
                (dynamicSchema as any)?.keyof()?._def.values) ||
                dynamicSchema.shape ||
                dynamicSchema
            )
          }
        >
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
    dynamicSchema,
    updateSchema: updateDynamicSchema as any,
    isEditing,
  };
};

/**
 * This is a wrapper component for useChakraForm hook. It takes the same props as useChakraForm hook and passes the return value to child callback function inside children
 * @param props useChakraFormProps
 * @param props.children callback function that takes useFormReturn as argument
 * @returns JSX.Element
 *
 * @example
 * ```tsx
 *
 * <ChakraFormWrapper
 *    schema={z.object({
 *        example1: z.string().min(3)
 *    })}
 * >
 *  {({ Form,Input }) => (
 *  <Form
 *    onSubmit={async (values) => { console.log(values) }}
 *  >
 *    <Input name="example1"  />
 * </Form>
 * )}
 * </ChakraFormWrapper>
 *
 * ```
 * */

export function ChakraFormWrapper<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props: UseChakraFormProps<TFieldValues, TContext> & {
    children: (props: UseChakraFormReturn<TFieldValues, TContext>) => JSX.Element;
  }
) {
  const useFormReturn = useChakraForm<TFieldValues, TContext>(props);

  return props.children(useFormReturn);
}

export function ChakraForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props: UseChakraFormProps<TFieldValues, TContext> & {
    render: (props: UseChakraFormReturn<TFieldValues, TContext>) => JSX.Element;
  }
) {
  const useFormReturn = useChakraForm<TFieldValues, TContext>(props);
  const View = props.render;

  return <View {...useFormReturn} />;
}
