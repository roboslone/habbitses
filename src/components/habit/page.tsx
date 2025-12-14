import { HabitFetcher } from "@/components/habit/fetcher"
import { useSelectedRepo } from "@/lib/git"
import { rHabit } from "@/routes"
import type React from "react"

import { PageHeader } from "../page-header"
import { RepoContext } from "../repo/context"
import { RepoSelector } from "../repo/selector"
import { HabitView } from "./view"

export const HabitPage: React.FC = () => {
    const [repo] = useSelectedRepo()
    const { name } = rHabit.useParams()

    if (repo === undefined) {
        return (
            <>
                <PageHeader title={name} />
                <div className="p-4">
                    <RepoSelector />
                </div>
            </>
        )
    }

    return (
        <RepoContext.Provider value={{ repo, names: [name] }}>
            <HabitFetcher name={name} mode="page">
                <HabitView />
            </HabitFetcher>
        </RepoContext.Provider>
    )
}

export default HabitPage
