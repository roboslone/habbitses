import { ErrorView } from "@/components/util/error-view"
import { LoadingScreen } from "@/components/util/loading-screen"
import * as colors from "@/lib/colors"
import { useStoredDisplayOptions } from "@/lib/displayOptions"
import { getProgress } from "@/lib/progress"
import { useHabit, useUpdateHabit } from "@/lib/queries"
import { cn } from "@/lib/utils"
import type React from "react"

import { HabitContext } from "./context"

interface P extends React.PropsWithChildren {
    name: string
    mode: "completed" | "active" | "page"
}

export const HabitFetcher: React.FC<P> = ({ name, children, mode }) => {
    const habit = useHabit(name)
    const update = useUpdateHabit(name)
    const [displayOptions] = useStoredDisplayOptions()

    if (habit.isLoading) {
        if (mode === "completed") {
            // Loading will be shown in `active` fetcher, avoid duplication.
            return null
        }
        return (
            <LoadingScreen
                label={name}
                className={cn("h-40 max-w-211 rounded", {
                    "h-14 justify-start px-3 *:data-[slot='label']:flex-row":
                        displayOptions.hideChart,
                })}
            />
        )
    }

    if (habit.data) {
        const { progress, completion } = getProgress(habit.data, new Date())
        const isCompleted = completion.count >= completion.target

        if (mode === "completed" && !isCompleted) {
            return null
        }
        if (mode === "active" && isCompleted) {
            // Habit will be shown in `completed` fetcher, avoid duplication.
            return null
        }

        return (
            <HabitContext
                value={{
                    habit: habit.data,
                    refetch: habit.refetch,
                    update,
                    isFetching: habit.isFetching,
                    progress,
                    completion,
                    isCompleted,
                    color: colors.forHabit(habit.data),
                }}
            >
                {children}
            </HabitContext>
        )
    }

    if (mode === "completed") {
        // Error will be shown in `active` fetcher, avoid duplication.
        return null
    }
    return <ErrorView error={habit.error} />
}
