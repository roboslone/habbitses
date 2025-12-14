import { PageHeader } from "@/components/page-header"
import { generateButtons } from "@/lib/buttons"
import { useNewHabit } from "@/lib/queries"
import type { Habit } from "@/proto/models/v1/models_pb"
import type React from "react"

import HabitForm from "./form"

export const NewHabbitPage: React.FC = () => {
    const saveHabit = useNewHabit()

    const handleSubmit = (habit: Habit) => {
        habit.buttons = generateButtons(habit)
        return saveHabit.mutateAsync(habit)
    }

    return (
        <>
            <PageHeader title="Start new habit" />
            <HabitForm onChange={handleSubmit} />
        </>
    )
}

export default NewHabbitPage
