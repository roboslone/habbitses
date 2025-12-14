import { useRepoContentContext } from "@/components/repo/content-context"
import { ErrorView } from "@/components/util/error-view"
import { LoadingScreen } from "@/components/util/loading-screen"
import { iterHabitNames } from "@/lib/git"
import { useCollection } from "@/lib/queries"
import type React from "react"

import { CollectionContext } from "./context"

export const CollectionView: React.FC<React.PropsWithChildren> = ({ children }) => {
    const collection = useCollection()
    const repoContent = useRepoContentContext()

    const habits = [...iterHabitNames(repoContent)]

    if (collection.isLoading) {
        return <LoadingScreen label="Loading collection..." />
    }

    if (collection.data) {
        const tags = Object.keys(collection.data.tags).sort()
        return (
            <CollectionContext.Provider value={{ collection: collection.data, tags, habits }}>
                <div data-testid="collection-view" className="flex flex-col items-center grow">
                    {children}
                </div>
            </CollectionContext.Provider>
        )
    }

    return <ErrorView error={collection.error} />
}
