import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface P {
  label?: string;
  className?: string;
}

export const LoadingScreen: React.FC<P> = ({
  label = "Loading...",
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-background h-full w-full flex items-center justify-center p-2",
        className
      )}
    >
      <div className="flex flex-col gap-2 text-background-foreground items-center justify-center">
        <Loader2 className="animate-spin" />
        {label}
      </div>
    </div>
  );
};
