import { db } from "./db";

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);

    if (!conversation) {
        console.log("no conversation")
        conversation = await createNewConversation(memberOneId, memberTwoId);
    }

    return conversation;
}


//find the first conversation record where the participants are memberOneId and memberTwoId profiles included
const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId: memberOneId },
                    { memberTwoId: memberTwoId },
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
    }
    catch (error) {
        return null;
    }
}




//creates a new conversation record in the database with the specified members and includes related profile information
const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        // Check if db and db.conversation are defined
        if (!db || !db.conversation) {
            throw new Error('Database client is not defined or conversation model is missing');
        }
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId,
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
    } catch (error) {
        console.log("error" + error)
        return null;
    }
}

