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
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
interface IProps {
  inputProps?: InputProps;
  editableProps?: EditableInputProps;
}

function EditableControls() {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup
      position="absolute"
      bottom={1}
      justifyContent="end"
      size="sm"
      // w="full"
      right={1}
      spacing={1}
      // mt={2}
      zIndex={200}
    >
      <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton icon={<CloseIcon boxSize={3} />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : null;
}
export function CustomEditable(props: IProps) {
  const { inputProps, editableProps } = props;

  return (
    <Editable
      // defaultValue=" "
      isPreviewFocusable={true}
      selectAllOnFocus={false}
      w="100%"
      position={'relative'}
      {...editableProps}
    >
      <Tooltip
        label="click to edit"
        placement="right"
        hasArrow={true}
        bgColor="shade.light"
        // opacity={0.1}
        sx={{ opacity: 0.1 }}
      >
        <EditablePreview
          py={2}
          px={4}
          _hover={{
            background: useColorModeValue('gray.100', 'gray.700'),
          }}
          w="100%"
          h="40px"
        />
      </Tooltip>
      <Input w="100%" py={2} px={4} as={EditableInput} {...inputProps} />
      <EditableControls />
    </Editable>
  );
}

// export function InputRow(props: IProps) {
//   return <CustomEditable />;
// }
