import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import React from "react"

interface P extends React.HTMLAttributes<HTMLDivElement> {
    label?: string
}

export const LoadingScreen: React.FC<P> = ({ label, ...rest }) => {
    return (
        <div
            data-testid="loading-screen"
            {...rest}
            className={cn(
                "bg-background h-full w-full flex items-center justify-center p-2",
                rest.className,
            )}
        >
            <div
                data-slot="label"
                className="flex flex-col gap-2 text-background-foreground items-center justify-center"
            >
                <Loader2 className="animate-spin" />
                {label}
            </div>
        </div>
    )
}
