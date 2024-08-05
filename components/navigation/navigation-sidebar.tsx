import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { NavigationItem } from "./navigation-iitem";
import { ModeToggle } from "../ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";


const NavigationSidebar = async () => {

    // get propfile
    const profile = await currentProfile();
    if (!profile) {
        return redirect("/");
    }

    // get servers
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });




    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3 bg-slate-300">
            <NavigationAction></NavigationAction>
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
            ></Separator>
            <ScrollArea className="flex-1 w-full">

                {servers.map((server) => (<div className="mb-4" key={server.id}>  <NavigationItem
                    id={server.id}
                    name={server.name}
                    imageUrl={server.imageUrl}
                />
                </div>))}

            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton appearance={{elements:{avatarBox:"h-[40px] w-[40px]"}}}></UserButton>
            </div>

        </div>
    );
}

export default NavigationSidebar;