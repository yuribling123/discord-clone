
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { useEffect } from "react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import ServerMember from "./server-member";


interface ServerSidebarProps {
    serverId: string;
}

export const ServerSidebar = async ({
    serverId
}: ServerSidebarProps) => {
    const iconMap = {
        [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
        [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
        [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
    };


    const roleIconMap = {
        [MemberRole.GUEST]: null,
        [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
        [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-indigo-500" />
    };





    const profile = await currentProfile();

    // ensure the user is login
    if (!profile) {
        return redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                }
            },
        },
    });


    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);

    const members = server?.members.filter((member) => member.profileId !== profile.id);




    if (!server) {
        return redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;



    // an array of objects representing different categories of channels and members

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
                server={server}
                role={role}
            />

            <ScrollArea className="flex-1 px-3">
                <div className="mt-2"></div>
                {/* search */}

                <ServerSearch data={[{
                    label: "Text Channels",
                    type: "channel",
                    data: textChannels?.map((channel) => ({
                        id: channel.id,
                        name: channel.name,
                        icon: iconMap[channel.type],
                    }))
                },
                {
                    label: "Audio Channels",
                    type: "channel",
                    data: audioChannels?.map((channel) => ({
                        id: channel.id,
                        name: channel.name,
                        icon: iconMap[channel.type],
                    }))
                },
                {
                    label: "Video Channels",
                    type: "channel",
                    data: videoChannels?.map((channel) => ({
                        id: channel.id,
                        name: channel.name,
                        icon: iconMap[channel.type],
                    }))
                },
                {
                    label: "Members",
                    type: "member",
                    data: members?.map((member) => ({
                        id: member.id,
                        name: member.profile.name,
                        icon: roleIconMap[member.role],
                    }))
                },


                ]} />

                <Separator className="bg-zinc-200 dark:bg-zinc-700 my-2 rounded-md "></Separator>

                {!!textChannels?.length && (<>

                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels "
                        />
                    </div>
                    {textChannels?.map((channel) => (<ServerChannel key={channel.id} channel={channel} server={server}></ServerChannel>))}

                </>)



                }


                {!!audioChannels?.length && (<>
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Audio Channels "
                        />
                    </div>
                    {audioChannels?.map((channel) => (<ServerChannel key={channel.id} channel={channel} server={server}></ServerChannel>))}


                </>)

                }

                {!!videoChannels?.length && (<>
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels "
                        />
                    </div>
                    {videoChannels?.map((channel) => (<ServerChannel key={channel.id} channel={channel} server={server}></ServerChannel>))}

                </>)

                }

                {!!members?.length && (<>
                    <div className="mb-2">
                        <ServerSection
                            sectionType="members"
                            server={server}
                            role={role}
                            label="Members "
                        />
                    </div>

                    {members?.map((member) => (<ServerMember key={member.id} member={member} server={server}></ServerMember>))}

                </>)

                }












            </ScrollArea>
        </div>
    );
};
