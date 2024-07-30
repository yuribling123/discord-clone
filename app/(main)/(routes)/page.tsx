import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
   <div> 
    <UserButton ></UserButton>
   <div className="flex item-center justify-center h-screen"> home </div>

   </div>
  );
}
