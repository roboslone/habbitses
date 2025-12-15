import type { useUpdateOrder } from "@/lib/queries"
import type { Habit } from "@/proto/models/v1/models_pb"
import React from "react"

interface S {
    update: ReturnType<typeof useUpdateOrder>
    completed: Set<string>
    recordCompletion: (h: Habit) => void
    orderedNames: string[]
    isReordering: boolean
    setReordering: (v: boolean) => void
}

export const OrderingContext = React.createContext<S | undefined>(undefined)

export const useOrderingContext = () => {
    const ctx = React.useContext(OrderingContext)
    if (ctx === undefined) throw new Error("ordering context unavailable")
    return ctx
}
