import {
    type Completion_ButtonOptions,
    Completion_ButtonOptionsSchema,
    type Habit,
} from "@/proto/models/v1/models_pb"
import { create } from "@bufbuild/protobuf"

export const generateButtons = (h: Habit): Completion_ButtonOptions[] => {
    if (h.dailyTarget === 1) return []

    if (h.dailyTarget <= 7)
        return [create(Completion_ButtonOptionsSchema, { kind: { case: "delta", value: 1 } })]

    if (h.dailyTarget <= 50)
        return [
            create(Completion_ButtonOptionsSchema, { kind: { case: "delta", value: 10 } }),
            create(Completion_ButtonOptionsSchema, { kind: { case: "complete", value: true } }),
        ]

    return [
        create(Completion_ButtonOptionsSchema, { kind: { case: "percentage", value: 10 } }),
        create(Completion_ButtonOptionsSchema, { kind: { case: "complete", value: true } }),
    ]
}
