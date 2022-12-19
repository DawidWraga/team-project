import { useCreateStore } from 'lib-client/useCreateStore';

export interface IModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  content: IModalContent;
  setContent: (content: IModalContent) => void;
}
export interface IModalContent {
  title: React.ReactNode;
  main: React.ReactNode;
}

export const useModalStore = useCreateStore<IModalStore>('Dialogue', (set) => ({
  isOpen: false,
  content: { title: '', main: '' },
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setContent: (content: IModalContent) => set({ content, isOpen: true }),
}));

// export interface IDialogueProps {}
// export const CustomDialogue = (props: IDialogueProps) => {
//   const { isOpen, onClose, content } = useModalStore();
//   const { title, main } = content;

//   return (
//     <Dialog open={isOpen} onClose={onClose}>
//       <CloseButton onClick={onClose} />
//       <DialogTitle>{title}</DialogTitle>
//       {main}
//     </Dialog>
//   );
// };
