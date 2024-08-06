
import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";


import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({ children, params }: { children: React.ReactNode; params: { serverId: string } }) => {
    const profile = await currentProfile();

    if (!profile) {
        return auth().redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            // from [serverId]
            id: params.serverId,
            members: {
                // make sure the current user have the only access
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (!server) {
        return redirect("/")
    }



    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
            {/* sidbar here */}
            <ServerSidebar serverId={params.serverId} ></ServerSidebar>
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>

    );
}

export default ServerIdLayout;
