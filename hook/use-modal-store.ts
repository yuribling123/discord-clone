// create a custom hook. Call onOpen to open the modal and onClose to close it
import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer"| "invite";

interface ModalData{
  server?:Server
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType,data?:ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data:{},
  isOpen: false,
  onOpen: (type,data={}) => {
    console.log("Opening modal with type:", type, data);
    set({ isOpen: true, type });
  },
  onClose: () => set({ type: null, isOpen: false })
}));
