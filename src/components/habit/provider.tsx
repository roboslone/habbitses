import { DateContext } from "@/components/date/context"
import { useOrderingContext } from "@/components/ordering/context"
import { Button } from "@/components/ui/button"
import { ErrorView } from "@/components/util/error-view"
import { LoadingScreen } from "@/components/util/loading-screen"
import * as colors from "@/lib/colors"
import { useStoredDisplayOptions } from "@/lib/displayOptions"
import { getProgress } from "@/lib/progress"
import { useHabit, useUpdateHabit } from "@/lib/queries"
import { cn } from "@/lib/utils"
import { RefreshCw } from "lucide-react"
import React from "react"

import { HabitContext } from "./context"
import { FileButton } from "./file-button"

interface P extends React.PropsWithChildren {
    name: string
}

export const HabitProvider: React.FC<P> = ({ name, children }) => {
    const today = React.useContext(DateContext)

    const habit = useHabit(name)
    const update = useUpdateHabit(name)
    const [displayOptions] = useStoredDisplayOptions()
    const { completed } = useOrderingContext()

    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)

    if (habit.isLoading) {
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
        const { completion, progress } = getProgress(habit.data, selectedDate ?? today)
        const isCompleted = completed.has(habit.data.name)

        return (
            <HabitContext
                value={{
                    habit: habit.data,
                    refetch: habit.refetch,
                    update,
                    isFetching: habit.isFetching,
                    progress,

                    selectedDate,
                    setSelectedDate,
                    completion,
                    isCompleted,
                    color: colors.forHabit(habit.data),
                }}
            >
                {children}
            </HabitContext>
        )
    }

    return (
        <div className="w-full max-w-211">
            <ErrorView title={name} error={habit.error}>
                <div className="flex items-center gap-2 w-full">
                    <FileButton name={name} />
                    <Button variant="ghost" onClick={() => void habit.refetch()}>
                        <RefreshCw />
                        Retry
                    </Button>
                </div>
            </ErrorView>
        </div>
    )
}
