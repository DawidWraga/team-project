import {
  EditablePreview,
  useColorModeValue,
  IconButton,
  Input,
  useEditableControls,
  ButtonGroup,
  Editable,
  Tooltip,
  EditableInput,
  EditableInputProps,
  EditableProps,
  EditableTextarea,
  EditableTextareaProps,
  EditablePreviewProps,
  Box,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { SxProps } from 'chakra-react-select';

interface IProps<TType extends 'text' | 'textarea' = 'text' | 'textarea'> {
  type?: TType;
  inputProps?: TType extends { type?: 'date' | 'text' }
    ? Omit<EditableInputProps, 'onSubmit'>
    : Omit<EditableTextareaProps, 'onSubmit'>;
  editableProps?: EditableProps;
  editablePreviewProps?: EditablePreviewProps;
  value: string;
  onSubmit?: (newValue: string) => void;
  allSx?: SxProps;
  inputAndPreviewSx?: SxProps;
  // renderPreview: (value: any) => JSX.Element | string;
  previewValue: (value: any) => string;
}

export function CustomEditable(props: IProps) {
  let {
    inputProps,
    editableProps,
    editablePreviewProps,
    allSx,
    inputAndPreviewSx,
    value,
    type,
    previewValue,
    // renderPreview,
  } = props;

  type ??= 'text';

  if (inputProps && (inputProps as any)?.type === 'date') {
    // value = moment;
  }
  const [currValue, setCurrValue] = useState(value || ' ');

  useEffect(() => {
    console.log(currValue);
  }, [currValue]);

  return (
    <Editable
      // placeholder={previewValue ? previewValue(currValue) : currValue}
      defaultValue={value}
      isPreviewFocusable={true}
      selectAllOnFocus={false}
      w="100%"
      position={'relative'}
      {...editableProps}
      onSubmit={(newValue) => {
        if (newValue === currValue) return;

        // props.onSubmit?.(newValue);
        setCurrValue(newValue);
      }}
      sx={allSx}
    >
      <Tooltip
        label="Edit"
        placement="right"
        hasArrow={true}
        bgColor={'pale.light'}
        border="1px solid gray.200"
      >
        <EditablePreview
          py={2}
          px={4}
          _hover={{
            // background: useColorModeValue('gray.100', 'gray.700'),
            outline: '1px solid lightgray',
          }}
          w="100%"
          h="40px"
          {...editablePreviewProps}
          sx={{ ...allSx, ...inputAndPreviewSx }}
        />
      </Tooltip>
      <Input
        // defaultValue={currValue}
        value={currValue}
        w="100%"
        py={2}
        px={4}
        minH={type === 'text' ? '40px' : '60px'}
        as={type === 'text' ? EditableInput : EditableTextarea}
        {...(inputProps as any)}
        sx={{ ...allSx, ...inputAndPreviewSx }}
      />
      <EditableControls type={type} />
    </Editable>
  );
}

interface IEditableControlProps {
  type: 'text' | 'textarea';
}
function EditableControls(props: IEditableControlProps) {
  const { type } = props;
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
    useEditableControls();

  return isEditing ? (
    <>
      <ButtonGroup
        position="absolute"
        justifyContent="end"
        size="sm"
        // w="full"
        {...(type === 'textarea' && { bottom: '10px', right: 0.25 })}
        {...(type === 'text' && { top: 1, right: 1, bottom: 1 })}
        spacing={1}
        zIndex={200}
      >
        <IconButton
          aria-label="confirm edit"
          icon={<CheckIcon />}
          {...getSubmitButtonProps()}
        />
        <IconButton
          aria-label="cancel edit"
          icon={<CloseIcon boxSize={3} />}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
      {type === 'textarea' && <Box h="40px" position="static"></Box>}
    </>
  ) : null;
}
