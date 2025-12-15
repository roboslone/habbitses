import { ErrorView } from "@/components/util/error-view"
import { LoadingPage } from "@/components/util/loading-page"
import { useRefresh, useRepoContent } from "@/lib/queries"
import React from "react"

import { RepoContentContext } from "./content-context"

export const RepoContentProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const content = useRepoContent()
    const refresh = useRefresh()

    if (content.isLoading) {
        return <LoadingPage label="Loading repository..." />
    }

    if (content.data) {
        return (
            <RepoContentContext.Provider value={content.data}>
                {children}
            </RepoContentContext.Provider>
        )
    }

    return <ErrorView error={content.error} retry={refresh} />
}
