import * as colors from "@/lib/colors"
import { cn } from "@/lib/utils"
import type React from "react"

export const ColorPreview: React.FC = () => (
    <div className="flex items-center gap-1">
        {colors.all.map((v) => (
            <div key={v} className={cn("h-6 w-6 rounded-xs", colors.get(v).background)}></div>
        ))}
    </div>
)
