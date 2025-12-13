import { useHabitContext } from "@/components/habit/context"
import * as colors from "@/lib/colors"
import * as icons from "@/lib/icons"
import { cn } from "@/lib/utils"
import { Loader2, type LucideProps } from "lucide-react"
import type React from "react"

export const HabitIcon: React.FC<LucideProps> = (props) => {
    const { habit, isFetching } = useHabitContext()
    const color = colors.index[colors.fromString(habit.color)]

    if (isFetching) {
        return <Loader2 {...props} className={cn("animate-spin", color.text, props.className)} />
    }

    return icons.render(habit.icon, {
        ...props,
        className: cn(color.text, props.className),
    })
}
