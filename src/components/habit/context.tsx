import * as colors from "@/lib/colors"
import type { useUpdateHabit } from "@/lib/queries"
import { type Completion, type Habit } from "@/proto/models/v1/models_pb"
import React from "react"

interface S {
    habit: Habit
    refetch: () => Promise<unknown>
    update: ReturnType<typeof useUpdateHabit>
    isFetching: boolean
    color: colors.Options
    completion: Completion
    isCompleted: boolean
    progress: number
}

export const HabitContext = React.createContext<S | undefined>(undefined)

export const useHabitContext = () => {
    const ctx = React.useContext(HabitContext)
    if (ctx === undefined) throw new Error("habit context unavailable")
    return ctx
}
