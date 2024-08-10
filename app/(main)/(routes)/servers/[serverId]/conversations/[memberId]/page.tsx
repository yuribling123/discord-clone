import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-message";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    };
}

const MemberIdPage = async ({
    params
}: MemberIdPageProps) => {

    console.log("convepage launch");

    const profile = await currentProfile();


    // the current login user's id
    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile?.id,
        },
        include: {
            profile: true,
        },
    });

    // check authentication
    if (!profile) {
        return auth().redirectToSignIn();
    }

    if (!currentMember) {
        return redirect("/");
    }

    //    console.log("currentMember.id:"+currentMember.id)
    //    console.log("params.memberId:"+ params.memberId)
    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

    console.log("conversation:" + conversation)
    if (!conversation) {
        return redirect(`/servers/${params.serverId}`)
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={params.serverId}
                type="conversation" />

            <ChatMessages
                member={currentMember}
                name={otherMember.profile.name}
                chatId={conversation.id}
                type="conversation"
                apiUrl="/api/direct-messages"
                paramKey="conversationId"
                paramValue={conversation.id}
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                    conversationId: conversation.id,
                }}
            />

            <ChatInput
                name={otherMember.profile.name}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{
                    conversationId: conversation.id,
                }} 
            />

        </div>
    );

}

export default MemberIdPage;