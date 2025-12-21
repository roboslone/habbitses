import { CollectionProvider } from "@/components/collection/provider"
import { OrderingProvider } from "@/components/ordering/provider"
import { PageHeader } from "@/components/page/header"
import { RepoContentProvider } from "@/components/repo/content-provider"
import { RepoContext } from "@/components/repo/context"
import { RepoSelector } from "@/components/repo/selector"
import { useSelectedRepo } from "@/lib/git"
import type React from "react"

import { Page } from "../page/page"

export const RepoWall: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [repo] = useSelectedRepo()

    if (repo === undefined) {
        return (
            <>
                <PageHeader title="Select repo" />
                <Page data-testid="repo-wall">
                    <RepoSelector />
                </Page>
            </>
        )
    }

    return (
        <RepoContext.Provider value={repo}>
            <RepoContentProvider>
                <CollectionProvider>
                    <OrderingProvider>{children}</OrderingProvider>
                </CollectionProvider>
            </RepoContentProvider>
        </RepoContext.Provider>
    )
}
