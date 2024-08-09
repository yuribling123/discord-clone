import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChartBar } from "lucide-react";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn();
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id,
        },
    });

    if (!member || !channel) {
        redirect("/")
    }



    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            {/* chat header */}
            <ChatHeader name={channel.name} serverId={channel.serverId} type={"channel"} imageUrl={""} ></ChatHeader>
            <div className="flex-1">Future Messages</div>
            {/* chat input */}

         
                <ChatInput apiUrl={"/api/socket/messages"} query={{ channelId: channel.id, serverId: channel.serverId }} name={channel.name} type={"channel"}></ChatInput>
    

        </div>

    );
}

export default ChannelIdPage;