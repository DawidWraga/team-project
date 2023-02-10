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
  InputProps,
  EditableInputProps,
  EditableProps,
  EditableTextarea,
  EditableTextareaProps,
  EditablePreviewProps,
  Box,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { SxProps } from 'chakra-react-select';

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

interface IProps<TType extends 'text' | 'textarea' = 'text' | 'textarea'> {
  type?: TType;
  inputProps?: TType extends 'text'
    ? Omit<EditableInputProps, 'onSubmit'>
    : Omit<EditableTextareaProps, 'onSubmit'>;
  editableProps?: EditableProps;
  editablePreviewProps?: EditablePreviewProps;
  value: string;
  onSubmit?: (newValue: string) => void;
  allSx?: SxProps;
  inputAndPreviewSx?: SxProps;
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
  } = props;

  type ??= 'text';
  // const [isServerSuccessful, setIsServerSuccessful] = useState(false);
  const [prevValue, setPrevValue] = useState(value || ' ');

  return (
    <Editable
      defaultValue={value}
      isPreviewFocusable={true}
      selectAllOnFocus={false}
      w="100%"
      position={'relative'}
      {...editableProps}
      onSubmit={(newValue) => {
        if (newValue === prevValue) return;

        props.onSubmit?.(newValue);
        setPrevValue(newValue);
      }}
      sx={allSx}
    >
      <Tooltip
        label="click to edit"
        placement="right"
        // hasArrow={true}
        bgColor={'pale.light'}
        border="1px solid gray.200"
        // opacity={0.1}
        // sx={{ opacity: 0.1 }}
      >
        <EditablePreview
          py={2}
          px={4}
          _hover={{
            background: useColorModeValue('gray.100', 'gray.700'),
          }}
          w="100%"
          h="40px"
          {...editablePreviewProps}
          sx={{ ...allSx, ...inputAndPreviewSx }}
        />
      </Tooltip>
      <Input
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
