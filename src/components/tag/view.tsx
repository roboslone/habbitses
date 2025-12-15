import * as colors from "@/lib/colors"
import * as icons from "@/lib/icons"
import { cn } from "@/lib/utils"
import type { Tag } from "@/proto/models/v1/models_pb"
import React from "react"

import { TagContext } from "./context"

interface P {
    name: string
    tag: Tag
}

export const TagView: React.FC<P> = ({ name, tag }) => {
    const ctx = React.useContext(TagContext)

    const active = ctx.active.has(name)
    const color = colors.get(tag.color)
    const icon = icons.render(tag.icon || "Tag", { className: cn(color.text), size: 14 })

    return (
        <div
            data-testid={`tag-${name}`}
            onClick={() => ctx.onClick?.(name)}
            className={cn(
                "flex items-center gap-1 p-1 px-2 rounded-md h-8 max-w-60 border text-sm",
                { "border-dashed": !active },
                { "bg-accent/20": active },
                { [color.border]: active },
                color.text,
                { "cursor-pointer": ctx.onClick !== undefined },
            )}
        >
            <div>{icon}</div>
            <span className="text-nowrap text-ellipsis overflow-hidden">{name}</span>
        </div>
    )
}
