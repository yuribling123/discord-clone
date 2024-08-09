// manages real-time updates and additions to a chat message data using WebSockets
import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile;
    };
};


export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey
}: ChatSocketProps) => {
    // sets up WebSocket listeners
    const { socket } = useSocket();
    // interact with the query cache
    const queryClient = useQueryClient();

    //initializes WebSocket listeners for both update (updateKey) and add (addKey) events, updating the cached message data
    useEffect(() => {
        if (!socket) {
            return;
        }


        // watch for update messages
        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                //replace old data with new data
                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithProfile) => {
                            if (item.id === message.id) {
                                return message;
                            }
                            return item;
                        })
                    };
                });

                return {
                    ...oldData,
                    pages: newData,
                };

            });
        });

        // watch for new messages
        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message],
                        }],
                    };
                }

                const newData = [...oldData.pages];

                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items,
                    ],
                };

                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });

        // listeners are properly removed when the component unmounts
        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        };



    }, [socket, updateKey, addKey, queryClient, queryKey]);

};
