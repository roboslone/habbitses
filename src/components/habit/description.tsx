import { useHabitContext } from "@/components/habit/context"
import { cn } from "@/lib/utils"
import type React from "react"

export const HabitDescription: React.FC = () => {
    const { habit } = useHabitContext()

    return (
        <p className={cn({ "text-muted-foreground": !habit.description })}>
            {habit.description || "No description"}
        </p>
    )
}
