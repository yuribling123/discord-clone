"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from 'react-hook-form';
import { zodResolver as zd } from "@hookform/resolvers/zod";

import * as z from "zod"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import { useRouter } from "next/navigation";
import axios from "axios"
import { useModal } from "@/hook/use-modal-store";
import { FileUploadAddServer } from "../file-upload-add-server";
import { Label } from "../ui/label";
import { Copy, RefreshCw } from "lucide-react";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "image is required."
    })
});


export const InviteModal = () => {

    const { isOpen, onClose, type } = useModal();

    const router = useRouter();

    const isModalOpen = isOpen && type === "invite";


    return (

        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label
                        className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                        Server invite link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value="invite-link"
                        />
                        <Button size="icon">
                            <Copy className="w-4 h-4" />
                        </Button>

                    </div>
                    <Button
                        variant="link"
                        size="sm"
                        className="text-xs text-zinc-500 mt-4"
                    >
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>

                </div>




            </DialogContent>
        </Dialog>

    );
}



