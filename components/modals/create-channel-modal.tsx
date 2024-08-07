"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm } from 'react-hook-form';
import { zodResolver as zd } from "@hookform/resolvers/zod";
import qs from "query-string"

import * as z from "zod"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useParams, useRouter } from "next/navigation";
import axios from "axios"
import { useModal } from "@/hook/use-modal-store";

import { ChannelType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";



export const CreateChannelModal = () => {

    const { isOpen, onClose, type } = useModal();

    const router = useRouter();

    const isModalOpen = isOpen && type === "createChannel";


    const formSchema = z.object({
        name: z.string().min(1, {
            message: "Channel name is required."
        }).refine(
            name => name !== "general",
            {
                message: "Channel name cannot be 'general'"
            }
        ),
        type: z.nativeEnum(ChannelType)
    });


    const form = useForm({
        resolver: zd(formSchema),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT,

        }
    });



    const isLoading = form.formState.isSubmitting;

    const params = useParams();
    //values conforms to the shape defined in formSchema
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            //construct a URL with query parameter
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: params?.serverId
                }
            });

            console.log("form values:"+values.type)
            await axios.post(url, values);


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
        //console.log("handleclose called")
    }



    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create Channel
                    </DialogTitle>
                </DialogHeader>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">channel name</FormLabel>
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

                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel Type</FormLabel>

                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isLoading}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                                >
                                                    <SelectValue placeholder="Select a channel type"></SelectValue>
                                                </SelectTrigger>
                                            </FormControl>


                                            {/* content */}
                                            <SelectContent className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className="capitalize"
                                                    >
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>


                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>



                        <DialogFooter className="px-6 py-4 bg-gray-100">

                            <Button variant="primary" disabled={isLoading} type="submit" >Create</Button>

                        </DialogFooter>
                    </form>
                </Form>






            </DialogContent>
        </Dialog>




    );
}



