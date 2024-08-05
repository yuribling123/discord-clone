// create a custom hook. Call onOpen to open the modal and onClose to close it
import { create } from "zustand";

export type ModalType = "createServer";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => {
    console.log("Opening modal with type:", type);
    set({ isOpen: true, type });
  },
  onClose: () => set({ type: null, isOpen: false })
}));
