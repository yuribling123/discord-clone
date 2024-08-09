;
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    console.log("handler")
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        
        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        // Add your processing logic here: check validity  
        // if (!profile) {
        //     return res.status(401).json({ error: "Unauthorized" });
        // }

        if (!serverId) {
            return res.status(400).json({ error: "Server ID missing" });
        }

        if (!channelId) {
            return res.status(400).json({ error: "Channel ID missing" });
        }

        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }


        // find server

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile?.id
                    }
                }
            },
            include: {
                members: true,
            }
        });

        if (!server) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // find channel
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            }
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // find member
        const member = server.members.find((member) => member.profileId === profile?.id);

        if (!member) {
            return res.status(403).json({ message: "Access denied: You are not a member of this server" });
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        // identifier for a specific chat channel to manage and emit messages
        const channelKey = `chat:${channelId}:messages`;
        
        //sends a message as the data payload with the channelKey as the event name to all clients subscribed to this channel
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);

    } catch (error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Error" });
    }
}
