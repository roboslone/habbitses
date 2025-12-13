import { CompletionSchema, type Habit } from "@/proto/models/v1/models_pb"
import { create } from "@bufbuild/protobuf"

import { formatDate } from "./dates"

export const getProgress = (habit: Habit, date: Date) => {
    const completion =
        habit.completions[formatDate(date)] ??
        create(CompletionSchema, {
            target: habit.dailyTarget,
        })

    let progress = 0
    if (completion.target !== 0) {
        progress = (completion.count / completion.target) * 100
    }

    return { completion, progress }
}
