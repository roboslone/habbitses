import { HabitProvider } from "@/components/habit/provider"
import { rHabit } from "@/routes"
import type React from "react"

import { HabitView } from "./view"

export const HabitPage: React.FC = () => {
    const { name } = rHabit.useParams()

    return (
        <HabitProvider name={name}>
            <HabitView />
        </HabitProvider>
    )
}

export default HabitPage
