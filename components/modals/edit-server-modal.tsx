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
import { useEffect } from "react";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "image is required."
    })
});


export const EditServerModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const { server } = data;

    const router = useRouter();

    const isModalOpen = isOpen && type === "editServer";


    const form = useForm({
        resolver: zd(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        if (server) {
            form.setValue("name", server.name);
            form.setValue("imageUrl", server.imageUrl);
        }
    }, [server, form]);


    //values conforms to the shape defined in formSchema
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            await axios.patch(`/api/servers/${server?.id}`, values);

            form.reset();
            router.refresh();
            form.reset();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
        console.log("handleclose called")
    }



    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>

                                                {/* <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange}></FileUpload> */}
                                                <FileUploadAddServer endpoint="serverImage" value={field.value} onChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />


                            </div>


                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Servername</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter server name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="px-6 py-4 bg-gray-100">

                            <Button variant="primary" disabled={isLoading} type="submit" >Save</Button>

                        </DialogFooter>
                    </form>
                </Form>


            </DialogContent>
        </Dialog>




    );
}



