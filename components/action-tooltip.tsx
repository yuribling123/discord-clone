import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";

interface ActionTooltipProps {
    label: string;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
  }
  export const ActionTooltip = ({
    label,
    children,
    side,
    align
  }: ActionTooltipProps) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            {children}
          </TooltipTrigger>
          <TooltipContent side={side} align={align}>
            <div className="font-normal text-sm capitalize bg-black p-1 m-1 rounded-sm ">{label.toLowerCase()}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
   