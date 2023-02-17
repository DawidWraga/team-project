import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { DragDownIndicator } from 'components/DragDownIndicator';
import { MotionProps } from 'framer-motion';
import { useModalStore } from 'lib-client/stores/ModalStore';
import { breakpoints } from 'utils/breakpoints';

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
        draggable={true}
        overflowX="hidden"
        minHeight={{ base: '75vh', lg: '500px' }}
        borderBottomRadius={{ base: '0', md: 'md' }}
        borderTopRadius={{ base: 'xl', md: 'md' }}
        overflowY={{ base: 'hidden', md: 'auto' }}
        // animate slide up from bottom for mobile devices
        {...(breakpoints.md('below') && {
          motionProps: slideFromScreenBottom(onClose),
        })}
        {...modalContentProps}
      >
        <DragDownIndicator />
        <ModalCloseButton opacity={{ base: 0, md: 1 }} />

        {/* ===== main content ==== */}
        <ModalHeader mt={{ base: 3, md: 0 }} {...modalHeaderProps}>
          {header}
        </ModalHeader>
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

const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const slideFromScreenBottom = (onSwipeDown: () => any): MotionProps => ({
  initial: { translateY: '90vh' },
  animate: {
    translateY: '20vh',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  exit: { translateY: '100vh', transition: { duration: 0.2, ease: 'easeInOut' } },
  drag: 'y',
  dragConstraints: { top: 0, bottom: 0 },
  onDragEnd: (e, { offset, velocity }) => {
    const swipe = swipePower(offset.y, velocity.y);
    if (swipe > 130 * 1000) {
      onSwipeDown();
    }
  },
  dragElastic: { top: 0, bottom: 1 },
});
