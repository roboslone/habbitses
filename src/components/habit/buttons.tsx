import { useHabitContext } from "@/components/habit/context"
import type { Button } from "@/components/ui/button"
import { Completion_ButtonOptionsSchema } from "@/proto/models/v1/models_pb"
import { create } from "@bufbuild/protobuf"
import type React from "react"

import { CompletionButton } from "./button"

interface P extends React.ComponentProps<typeof Button> {
    max?: number
}

export const CompletionButtons: React.FC<P> = ({ max, ...rest }) => {
    const { habit } = useHabitContext()

    let buttons = habit.buttons
    if (max !== undefined) {
        buttons = buttons.slice(0, max)
    }
    if (buttons.length === 0) {
        buttons = [
            create(Completion_ButtonOptionsSchema, {
                kind: { case: "complete", value: true },
            }),
        ]
    }

    return (
        <>
            {buttons.map((b, key) => (
                <CompletionButton key={key} options={b} {...rest} />
            ))}
        </>
    )
}
