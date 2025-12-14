import type { Collection } from "@/proto/models/v1/models_pb"
import React from "react"

interface S {
    collection: Collection
    tags: string[]
    habits: string[]
}

export const CollectionContext = React.createContext<S | undefined>(undefined)

export const useCollectionContext = () => {
    const ctx = React.useContext(CollectionContext)
    if (ctx === undefined) throw new Error("collection context unavailable")
    return ctx
}
