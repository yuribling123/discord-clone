// processes DELETE and PATCH requests to either delete or update a direct message within a specific conversation
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const profile = await currentProfilePages(req);
        const { conversationId, directMessageId } = req.query;
        const { content } = req.body;

        // Additional logic here

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        if (!conversationId) {
            return res.status(404).json({ error: "ConversationId not found" });
        }


        if (!directMessageId) {
            return res.status(404).json({ error: "DirectMessageId not found" });
        }


        // find conversation


        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id,
                        },
                    },
                    {
                        memberTwo: {
                            profileId: profile.id,
                        },
                    },
                ],
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },

        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const member = conversation.memberOne.profileId === profile.id
            ? conversation.memberOne
            : conversation.memberTwo;

        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
    



        if (!directMessage || directMessage.deleted) {
            return res.status(404).json({ error: "directMessage not found or is deleted" });
        }

        // check authority
        const isdirectMessageOwner = directMessage.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isdirectMessageOwner || isAdmin || isModerator;

        if (!canModify) {
            return res.status(401).json({ error: "Unauthorized" });
        }


        // ** the actual delete method 
        if (req.method === "DELETE") {
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    fileUrl: null,
                    content: "This directMessage has been deleted.",
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        }

        // ** the actual edit method 
        if (req.method === "PATCH") {
            if (!isdirectMessageOwner) {
                return res.status(401).json({ error: "Unauthorized" })

            }
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: { 
                    content
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        }

        const updateKey = `chat:${conversationId}:directMessages:update`;

        //emit a directMessage to all clients  connected to the Socket.IO server
        res?.socket?.server?.io?.emit(updateKey, directMessage);
        //When the event is received, the client executes the callback function processing the directMessage socket.on...

        return res.status(200).json(directMessage);


    } catch (error) {
        console.log("[MESSAGE_ID]", error);
        return res.status(500).json({ error: "Internal Error" });
    }
}
