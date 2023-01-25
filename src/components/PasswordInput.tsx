import {
  InputProps,
  useDisclosure,
  useMergeRefs,
  InputGroup,
  InputRightElement,
  IconButton,
  Input,
  FormLabel,
} from '@chakra-ui/react';
import { forwardRef, useRef } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export const PasswordInput = forwardRef<HTMLInputElement, InputProps & { label: string }>(
  ({ label, ...props }, ref) => {
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef<HTMLInputElement>(null);

    const mergeRef = useMergeRefs(inputRef, ref);
    const onClickReveal = () => {
      onToggle();
      if (inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    return (
      <InputGroup>
        <Input
          ref={mergeRef}
          name="password"
          autoComplete="current-password"
          required
          {...props}
          type={isOpen ? 'text' : 'password'}
        />
        <FormLabel textTransform={'capitalize'}>{label}</FormLabel>
        <InputRightElement>
          <IconButton
            variant="link"
            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
            icon={isOpen ? <HiEyeOff /> : <HiEye />}
            onClick={onClickReveal}
          />
        </InputRightElement>
      </InputGroup>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
