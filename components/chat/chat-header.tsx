import { Hash, Menu } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import UserAvatar from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";
import { ChatVideoButton } from "./chat-video-button";
import Image from "next/image";
import icon from "@/assets/header-cat.png"


interface chatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl: string;

}


const ChatHeader = ({ serverId, name, type, imageUrl }: chatHeaderProps) => {
  const iconUrl = "https://www.imghippo.com/i/MpIQH1723256564.png"
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">

      {/* for mobile device */}
      <MobileToggle serverId={serverId}></MobileToggle>


      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type == "conversation" && (<UserAvatar src={imageUrl} ></UserAvatar>)}
      <p className="font-semibold text-sm text-black dark:text-white p-4 ">
        {name}
      </p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && (<ChatVideoButton></ChatVideoButton>)}
        <Image
          src={icon}
          width={50}
          height={50}
          alt="Picture of the author"
        />
        <SocketIndicator></SocketIndicator>
      </div>




    </div>

  );
}

export default ChatHeader;