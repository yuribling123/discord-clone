"use client"

import { cn } from "@/lib/utils";
import { MemberRole, ChannelType, Channel, Server } from "@prisma/client";
import { channel } from "diagnostics_channel";


import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter  } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { ModalType, useModal } from "@/hook/use-modal-store";


interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
};



export const ServerChannel = ({
    channel,
    server,
    role,
}: ServerChannelProps) => {

    const Icon = iconMap[channel.type];
    const params = useParams();
    const route = useRouter();

    const {onOpen} = useModal();
    
    const onClick =()=>{
        console.log("onclick clicked")
        route .push (`/servers/${params?.serverId}/channels/${channel.id}`)  
    }

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        // prevent the parent element's event listener from being triggered
        e.stopPropagation();
        onOpen(action,{channel,server});
      }
      
    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId == channel.id && "bg-zinc-700"
            )}
        >
            {/* icon */}
            <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            {/* name */}
            <p className={cn("line-clamp-1 font-semibold text-sm group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.channelId == channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}
            >{channel.name}</p>


            <div className="ml-auto flex items-center gap-x-2">
                {channel.name !== "general" && role !== MemberRole.GUEST && (
                    <>
                        <ActionTooltip label="Edit" side="top">
                            <Edit onClick={(e)=>onAction(e,"editChannel")}
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
                        </ActionTooltip>
                        <ActionTooltip label="Delete" side="top">
                            <Trash className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
                        </ActionTooltip>
                    </>
                )}

                {channel.name === "general" && (
                    <Lock className="group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
                )}
            </div>


        </button>

    );
};
