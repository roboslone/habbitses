import { HabitCard } from "@/components/habit/card"
import { HabitFetcher } from "@/components/habit/fetcher"
import { Button } from "@/components/ui/button"
import { ErrorView } from "@/components/util/error-view"
import { LoadingScreen } from "@/components/util/loading-screen"
import { type Repo, parseRepoContent } from "@/lib/git"
import { useRefresh, useRepoContent } from "@/lib/queries"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { Plus, RefreshCw } from "lucide-react"
import React from "react"
import PullToRefresh from "react-pull-to-refresh"

import { RepoContext } from "./context"

interface P {
    repo: Repo
}

export const RepoViewer: React.FC<P> = ({ repo }) => {
    const content = useRepoContent(repo, true)
    const refresh = useRefresh()

    if (content.isLoading) {
        return <LoadingScreen label="Loading repository..." />
    }

    if (content.data) {
        const names = [...parseRepoContent(content.data)]
        return (
            <PullToRefresh onRefresh={refresh} className="h-full [&>div.refresh-view]:h-full">
                <RepoContext.Provider value={{ repo, names }}>
                    <div className="flex flex-col items-center gap-2 p-2 pt-0 h-full">
                        <div className="flex flex-col items-center gap-2 w-full">
                            {names.map((name) => (
                                <HabitFetcher key={name} name={name} mode="active">
                                    <HabitCard />
                                </HabitFetcher>
                            ))}
                        </div>

                        <div className="flex flex-col items-center gap-2 w-full">
                            {names.map((name) => (
                                <HabitFetcher key={name} name={name} mode="completed">
                                    <HabitCard />
                                </HabitFetcher>
                            ))}
                        </div>

                        {names.length === 0 && (
                            <>
                                <Link to="/habits/new">
                                    <Button size="lg">
                                        <Plus />
                                        Start a new habit!
                                    </Button>
                                </Link>
                            </>
                        )}

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
                    </div>
                </RepoContext.Provider>
            </PullToRefresh>
        )
    }

    return <ErrorView error={content.error} retry={content.refetch} />
}
