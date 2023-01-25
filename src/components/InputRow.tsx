import {
  EditablePreview,
  Box,
  useColorModeValue,
  IconButton,
  Input,
  useDisclosure,
  useEditableControls,
  ButtonGroup,
  SlideFade,
  Editable,
  Tooltip,
  EditableInput,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
interface IProps {}

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
      spacing={2}
      // mt={2}
      zIndex={200}
    >
      {/* <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} /> */}
      <IconButton icon={<CloseIcon boxSize={3} />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : null;
}
export function CustomEditable(props: IProps) {
  const {} = props;

  return (
    <Editable
      defaultValue="Rasengan ⚡️"
      isPreviewFocusable={true}
      selectAllOnFocus={false}
      w="100%"
      position={'relative'}
    >
      <Tooltip label="Click to edit">
        <EditablePreview
          py={2}
          px={4}
          _hover={{
            background: useColorModeValue('gray.100', 'gray.700'),
          }}
        />
      </Tooltip>
      <Input w="100%" py={2} px={4} as={EditableInput} />
      <EditableControls />
    </Editable>
  );
}

export function InputRow(props: IProps) {
  return <CustomEditable />;
}
