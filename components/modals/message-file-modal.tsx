"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from 'react-hook-form';
import { zodResolver as zd } from "@hookform/resolvers/zod";

import * as z from "zod"
import qs from "query-string"

import { FormField, FormItem, FormControl,  Form } from "../ui/form";

import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import { useRouter } from "next/navigation";
import axios from "axios"
import { useModal } from "@/hook/use-modal-store";


const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachment is required."
    })
});


const MessageFileModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "messageFile"

    const { apiUrl, query } = data;

    const router = useRouter();

    const form = useForm({
        resolver: zd(formSchema),
        defaultValues: {
            fileUrl: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    //values conforms to the shape defined in formSchema
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });

            console.log("onsubmit")
            console.log(url)

            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            });

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };


    const handleClose = () => {
        form.reset();
        onClose();
    }







    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an Attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        send a file
                    </DialogDescription>
                </DialogHeader>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange}></FileUpload>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />


                            </div>



                        </div>
                        <DialogFooter className="px-6 py-4 bg-gray-100">

                            <Button variant="primary" disabled={isLoading} type="submit" >Upload</Button>

                        </DialogFooter>
                    </form>
                </Form>


            </DialogContent>
        </Dialog>




    );
}

export default MessageFileModal;


