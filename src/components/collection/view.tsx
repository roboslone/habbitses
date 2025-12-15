import { useRepoContentContext } from "@/components/repo/content-context"
import { ErrorView } from "@/components/util/error-view"
import { LoadingPage } from "@/components/util/loading-page"
import { iterHabitNames } from "@/lib/git"
import { getProgress } from "@/lib/progress"
import { useCollection } from "@/lib/queries"
import type { Habit } from "@/proto/models/v1/models_pb"
import React from "react"

import { CollectionContext } from "./context"

export const CollectionView: React.FC<React.PropsWithChildren> = ({ children }) => {
    const collection = useCollection()
    const repoContent = useRepoContentContext()

    const [completed, setCompleted] = React.useState<Set<string>>(new Set())
    const recordCompletion = (h: Habit) => {
        const { completion } = getProgress(h, new Date())
        const isCompleted = completion.count >= completion.target

        setCompleted((prev) => {
            const next = new Set(prev)
            if (isCompleted) {
                next.add(h.name)
            } else {
                next.delete(h.name)
            }
            return next
        })
    }

    const habits = [...iterHabitNames(repoContent)]

    if (collection.isLoading) {
        return <LoadingPage label="Loading collection..." />
    }

    if (collection.data) {
        const tags = Object.keys(collection.data.tags).sort()
        return (
            <CollectionContext.Provider
                value={{
                    collection: collection.data,
                    tags,
                    tagSet: new Set(tags),
                    habits,
                    habitNameSet: new Set(habits),
                    completed,
                    recordCompletion,
                }}
            >
                <div data-testid="collection-view" className="flex flex-col items-center grow">
                    {children}
                </div>
            </CollectionContext.Provider>
        )
    }

    return <ErrorView error={collection.error} />
}
