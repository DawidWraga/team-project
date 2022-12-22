import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { MotionProps } from 'framer-motion';
import { useModalStore } from 'stores/ModalStore';
import { breakpoints } from 'utils/breakpoints';

const slideFromScreenBottom: MotionProps = {
  initial: { y: '90vh' },
  animate: {
    y: '20vh',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  exit: { y: '100vh', transition: { duration: 0.2, ease: 'easeInOut' } },
};

export const MainModal = () => {
  const { isOpen, onClose, content } = useModalStore();
  const {
    header,
    body,
    footer,
    modalProps,
    modalOverlayProps,
    modalContentProps,
    modalHeaderProps,
    modalBodyProps,
    modalFooterProps,
  } = content;

  return (
    //context provider
    <Modal
      size={'xl'}
      isOpen={isOpen}
      onClose={onClose}
      motionPreset={'slideInBottom'}
      {...modalProps}
    >
      {/* shadow backdrop */}
      <ModalOverlay opacity={{ base: 0.3, md: 0.5 }} {...modalOverlayProps} />

      {/* wrapper */}
      <ModalContent
        minHeight={{ base: '75vh', lg: '500px' }}
        borderBottomRadius={{ base: '0', md: 'md' }}
        // animate slide up from bottom for mobile devices
        {...(breakpoints.md('below') && {
          motionProps: slideFromScreenBottom,
        })}
        {...modalContentProps}
      >
        <ModalCloseButton />

        {/* ===== main content ==== */}
        <ModalHeader {...modalHeaderProps}>{header}</ModalHeader>
        <ModalBody w="100%" display="flex" justifyContent={'center'} {...modalBodyProps}>
          {body}
        </ModalBody>
        {footer && (
          <ModalFooter w="100%" {...modalFooterProps}>
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
