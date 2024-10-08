"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";



interface FileUploadAddServerProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUploadAddServer = ({
  onChange,
  value,
  endpoint
}: FileUploadAddServerProps) => {

  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full"
        />
        <button onClick={()=>onChange("")}
          className="top-0 right-0 shadow-sm bg-rose-500 rounded-full absolute text-white "  type="button"> 
           <X className="h-4 w-4"></X>
         </button>
      </div>
    );
  }




  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
