import GitHubLogo from "@/assets/github.svg?url"
import { cn } from "@/lib/utils"
import type React from "react"

interface P extends React.HTMLAttributes<HTMLImageElement> {
    inverted?: boolean
}

export const GitHubIcon: React.FC<P> = (props) => {
    const { inverted, className, ...rest } = props

    return (
        <img
            src={GitHubLogo}
            {...rest}
            className={cn("h-6 w-6", { "dark:invert": inverted }, { invert: !inverted }, className)}
        />
    )
}
