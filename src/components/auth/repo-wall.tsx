import { PageHeader } from "@/components/page-header"
import { RepoContentView } from "@/components/repo/content-view"
import { RepoContext } from "@/components/repo/context"
import { RepoSelector } from "@/components/repo/selector"
import { useSelectedRepo } from "@/lib/git"
import type React from "react"

export const RepoWall: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [repo] = useSelectedRepo()

    if (repo === undefined) {
        return (
            <>
                <PageHeader title="Select repo" />
                <div className="p-5">
                    <RepoSelector />
                </div>
            </>
        )
    }

    return (
        <RepoContext.Provider value={repo}>
            <RepoContentView>{children}</RepoContentView>
        </RepoContext.Provider>
    )
}
