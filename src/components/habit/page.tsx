import { HabitFetcher } from "@/components/habit/fetcher"
import { rHabit } from "@/routes"
import type React from "react"

import { HabitView } from "./view"

export const HabitPage: React.FC = () => {
    const { name } = rHabit.useParams()

    return (
        <HabitFetcher name={name} mode="page">
            <HabitView />
        </HabitFetcher>
    )
}

export default HabitPage
