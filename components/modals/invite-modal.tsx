"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import * as z from "zod"

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useRouter } from "next/navigation";
import axios from "axios"
import { useModal } from "@/hook/use-modal-store";

import { Label } from "../ui/label";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hook/use-origin";
import { useState } from "react";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "image is required."
    })
});


export const InviteModal = () => {

    const { onOpen, isOpen, onClose, type, data } = useModal();
    //console.log("data" + data.server);

    const router = useRouter();

    const isModalOpen = isOpen && type === "invite";

    const { server } = data;
    const origin = useOrigin();

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };


    const onNew = async () => {
        try {
            setIsLoading(true);
           
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)

            console.log("response:"+ response)
            onOpen("invite", { server: response.data});

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };


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
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl}
                        />
                        <Button size="icon" onClick={onCopy} disabled={isLoading}>

                            {
                                copied
                                    ? <Check className="w-4 h-4" />
                                    : <Copy className="w-4 h-4" />
                            }
                        </Button>

                    </div>
                    <Button
                        onClick={onNew}
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



