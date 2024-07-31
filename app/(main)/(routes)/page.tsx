import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
   <div> 
    <div className="flex flex-row justify-between"><ModeToggle></ModeToggle> <UserButton ></UserButton></div>

   <div className="flex item-center justify-center h-screen"> home </div>

   </div>
  );
}
