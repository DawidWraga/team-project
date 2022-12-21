import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalProps,
  ModalOverlayProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  Box,
} from '@chakra-ui/react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { useCreateStore } from 'lib-client/useCreateStore';
import { useEffect } from 'react';
import { screenIsSm } from 'utils/checkScreenWidth';

export interface IModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  content: IModalContent;
  setContent: (content: IModalContent) => void;
}
export interface IModalContent {
  title: React.ReactNode;
  main?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  modalProps?: Omit<ModalProps, 'isOpen' | 'onClose'>;
  modalHeaderProps?: ModalHeaderProps;
  modalOverlayProps?: ModalOverlayProps;
  modalContentProps?: ModalContentProps;
  modalBodyProps?: ModalBodyProps;
  modalFooterProps?: ModalFooterProps;
}

export const useModalStore = useCreateStore<IModalStore>('Dialogue', (set) => ({
  isOpen: false,
  content: { title: '', main: '' },
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setContent: (content: IModalContent) => set({ content, isOpen: true }),
}));

const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export interface IDialogueProps {}
export const CustomDialogue = (props: IDialogueProps) => {
  const { isOpen, onClose, content } = useModalStore();
  const {
    title,
    main,
    body,
    footer,
    modalProps,
    modalOverlayProps,
    modalContentProps,
    modalHeaderProps,
    modalBodyProps,
    modalFooterProps,
  } = content;

  // const controls = useAnimation();
  // useEffect(() => {
  //   controls.start('visible');
  // }, []);

  return (
    <Modal
      size={'xl'}
      isOpen={isOpen}
      onClose={onClose}
      motionPreset={screenIsSm() ? 'none' : 'slideInBottom'}
      {...modalProps}
    >
      <ModalOverlay opacity={{ base: '0.3', lg: '.8' }} {...modalOverlayProps} />

      <ModalContent
        minHeight={{ base: '75vh', lg: '500px' }}
        position={'absolute'}
        overflowY="hidden"
        display="flex"
        alignItems={'center'}
        borderBottomRadius={{ base: '0', sm: 'md' }}
        {...(screenIsSm() && {
          motionProps: {
            initial: { y: '70vh' },
            animate: { y: '20vh' },
            exit: { y: '100vh', transition: { duration: 0.2 } },
            transition: {
              duration: 0.4,
              bounceDamping: 25,
              bounceStiffness: 900,
              stiffness: 1000,
              mass: 3,
              damping: 20,
              ease: 'easeIn',
            },
          },
        })}
        {...modalContentProps}
      >
        <ModalHeader {...modalHeaderProps}>{title}</ModalHeader>
        <ModalCloseButton />
        {main && main}
        {body && <ModalBody {...modalBodyProps}>{body}</ModalBody>}
        {footer && (
          <ModalFooter w="100%" {...modalFooterProps}>
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
