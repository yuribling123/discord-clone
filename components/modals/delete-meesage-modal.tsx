import { useModal } from "@/hook/use-modal-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import qs from "query-string";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import axios from "axios";

export const DeleteMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "deleteMessage";
    const { apiUrl, query } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });
            
            await axios.delete(url);
            
            onClose();

            
            // Additional logic can be added here
        } catch (error) {
            // Handle error here
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose();

    }

    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-xl text-center font-bold">
                        Delete this Message
                    </DialogTitle>
                </DialogHeader>







                <DialogFooter className="flex px-6 py-4 ">
                    <div className="flex items-center justify-center w-full">
                        <Button variant="primary" disabled={isLoading} type="submit" onClick={onClick} >Confirm</Button>
                    </div>
                </DialogFooter>






            </DialogContent>
        </Dialog>

    );
};
