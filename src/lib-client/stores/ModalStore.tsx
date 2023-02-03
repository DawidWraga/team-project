import {
  ModalProps,
  ModalOverlayProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
} from '@chakra-ui/react';
import { createStore } from 'lib-client/hooks/createStore';

export interface IModalStore {
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  content: IModalContent;
  setContent?: (content: IModalContent) => void;
}
export interface IModalContent {
  header: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
  modalProps?: Omit<ModalProps, 'isOpen' | 'onClose'>;
  modalHeaderProps?: ModalHeaderProps;
  modalOverlayProps?: ModalOverlayProps;
  modalContentProps?: ModalContentProps;
  modalBodyProps?: ModalBodyProps;
  modalFooterProps?: ModalFooterProps;
}

export const useModalStore = createStore<IModalStore>('Dialogue', (set) => ({
  isOpen: false,
  content: { header: '', body: '' },
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setContent: (content: IModalContent) => set({ content, isOpen: true }),
}));
