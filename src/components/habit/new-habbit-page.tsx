import { PageHeader } from "@/components/page-header"
import { useNewHabit } from "@/lib/queries"
import type React from "react"

import HabitForm from "./form"

export const NewHabbitPage: React.FC = () => {
    const saveHabit = useNewHabit()

    return (
        <>
            <PageHeader title="Start new habit" />
            <HabitForm onChange={saveHabit.mutateAsync} />
        </>
    )
}

export default NewHabbitPage
