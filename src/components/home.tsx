import { RepoSelector } from "@/components/repo/selector"
import { useSelectedRepo } from "@/lib/git"
import { Link } from "@tanstack/react-router"
import { Cog, Plus } from "lucide-react"
import type React from "react"

import { PageHeader } from "./page-header"
import { RepoViewer } from "./repo/viewer"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export const Home: React.FC = () => {
    const [repo] = useSelectedRepo()

    return (
        <>
            <PageHeader
                title="Habbitses"
                buttonLeft={
                    <Link to="/settings">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon-lg">
                                    <Cog />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Settings</TooltipContent>
                        </Tooltip>
                    </Link>
                }
                buttonRight={
                    <Link to="/habits/new">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon-lg">
                                    <Plus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Start new habbit</TooltipContent>
                        </Tooltip>
                    </Link>
                }
            />

            {repo === undefined && (
                <div className="flex flex-col items-center justify-center gap-2 p-5">
                    <RepoSelector />
                </div>
            )}

            {repo !== undefined && <RepoViewer repo={repo} />}
        </>
    )
}

export default Home
