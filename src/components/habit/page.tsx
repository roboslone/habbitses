import { HabitFetcher } from "@/components/habit/fetcher"
import { PageHeader } from "@/components/page-header"
import { useRepoContext } from "@/components/repo/context"
import { RepoSelector } from "@/components/repo/selector"
import { rHabit } from "@/routes"
import type React from "react"

import { HabitView } from "./view"

export const HabitPage: React.FC = () => {
    const repo = useRepoContext()
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
        <HabitFetcher name={name}>
            <HabitView />
        </HabitFetcher>
    )
}

export default HabitPage
