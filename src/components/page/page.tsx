import { cn } from "@/lib/utils"
import type React from "react"

type P = React.PropsWithChildren & React.HTMLAttributes<HTMLDivElement>

export const Page: React.FC<P> = (props) => (
    <div
        data-testid="page"
        {...props}
        className={cn("w-full h-full flex flex-col gap-6 px-4", props.className)}
    >
        {props.children}
    </div>
)
