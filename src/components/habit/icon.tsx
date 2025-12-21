import { useHabitContext } from "@/components/habit/context"
import { useOrderingContext } from "@/components/ordering/context"
import * as colors from "@/lib/colors"
import * as icons from "@/lib/icons"
import { cn } from "@/lib/utils"
import { GripVertical, Loader2, type LucideProps } from "lucide-react"
import React from "react"

export const HabitIcon: React.FC<LucideProps> = (props) => {
    const { isReordering } = useOrderingContext()
    const { habit, isFetching } = useHabitContext()
    const color = colors.index[colors.fromString(habit.color)]

    if (isFetching) {
        return (
            <Loader2
                data-testid="habit-icon-locader"
                {...props}
                className={cn("animate-spin", color.text, props.className)}
            />
        )
    }

    const className = cn(color.text, props.className, {
        "cursor-move": isReordering,
    })
    const finalProps = { ...props, className, "data-testid": "habit-icon" }

    if (isReordering) return React.createElement(GripVertical, finalProps)
    return icons.render(habit.icon, finalProps)
}
