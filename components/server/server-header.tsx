"use client";

import { ServerWithMembersWithProfiles } from "@/type";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus } from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useModal } from "@/hook/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
}

export const ServerHeader = ({
    server,
    role
}: ServerHeaderProps) => {
    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;
    const {onOpen} = useModal();

    const inviteOnclick = ()=>{onOpen("invite", {server});console.log("invite click")}
    const editOnclick = ()=>{onOpen("editServer", {server});console.log("edit click")}


    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="focus:outline-none"
                asChild
            >
                <button
                    className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                >
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>

            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
                {isModerator && (
                    <DropdownMenuItem
                        onClick={inviteOnclick}
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                    >
                        Invite People
                        <UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={editOnclick}
                        className=" px-3 py-2 text-sm cursor-pointer"
                    >
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        className=" px-3 py-2 text-sm cursor-pointer"
                    >
                        Manage Members
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem
                        className=" px-3 py-2 text-sm cursor-pointer"
                    >
                        Create Channel
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {
                    isModerator && (<DropdownMenuSeparator />)
                }

                {isAdmin && (
                    <DropdownMenuItem
                        className=" text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        Delete Server
                        <Trash className="h-4 w-4 ml -auto" />
                    </DropdownMenuItem>
                )}
                 {!isAdmin && (
                    <DropdownMenuItem
                        className=" text-rose-500 px-3 py-2 text-sm cursor-pointer"
                    >
                        Leave Server
                        <LogOut className="h-4 w-4 ml -auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>

        </DropdownMenu>

    );
};
