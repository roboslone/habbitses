import type { Collection, Habit } from "@/proto/models/v1/models_pb"
import React from "react"

interface S {
    collection: Collection
    tags: string[]
    tagSet: Set<string>
    habits: string[]
    habitNameSet: Set<string>
    completed: Set<string>
    recordCompletion: (h: Habit) => void
}

export const CollectionContext = React.createContext<S | undefined>(undefined)

export const useCollectionContext = () => {
    const ctx = React.useContext(CollectionContext)
    if (ctx === undefined) throw new Error("collection context unavailable")
    return ctx
}
