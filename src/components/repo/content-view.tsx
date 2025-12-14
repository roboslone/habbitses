import { CollectionView } from "@/components/collection/view"
import { Button } from "@/components/ui/button"
import { ErrorView } from "@/components/util/error-view"
import { LoadingScreen } from "@/components/util/loading-screen"
import { useRefresh, useRepoContent } from "@/lib/queries"
import { cn } from "@/lib/utils"
import { RefreshCw } from "lucide-react"
import React from "react"
import PullToRefresh from "react-pull-to-refresh"

import { RepoContentContext } from "./content-context"

export const RepoContentView: React.FC<React.PropsWithChildren> = ({ children }) => {
    const content = useRepoContent()
    const refresh = useRefresh()

    if (content.isLoading) {
        return <LoadingScreen label="Loading repository..." />
    }

    if (content.data) {
        return (
            <PullToRefresh
                onRefresh={() => refresh()}
                className="h-full [&>div.refresh-view]:h-full"
                data-testid="repo-content-view"
            >
                <RepoContentContext.Provider value={content.data}>
                    <CollectionView>{children}</CollectionView>

                    <div className="flex justify-center p-2">
                        <Button
                            variant="ghost"
                            disabled={content.isFetching}
                            onClick={() => void refresh()}
                        >
                            <RefreshCw className={cn({ "animate-spin": content.isFetching })} />
                            Refresh
                        </Button>
                    </div>
                </RepoContentContext.Provider>
            </PullToRefresh>
        )
    }

    return <ErrorView error={content.error} retry={refresh} />
}
