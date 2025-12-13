import { type Habit_DisplayOptions, Habit_DisplayOptionsSchema } from "@/proto/models/v1/models_pb"
import { create, merge } from "@bufbuild/protobuf"
import useLocalStorage from "use-local-storage"

export const useStoredDisplayOptions = () => {
    return useLocalStorage<Habit_DisplayOptions>(
        "habbitses/displayOptions/v1",
        create(Habit_DisplayOptionsSchema, {}),
        {
            syncData: true,
        },
    )
}

export const mergeDisplayOptions = (
    ...opts: Array<Habit_DisplayOptions | undefined>
): Habit_DisplayOptions => {
    const result = create(Habit_DisplayOptionsSchema, {})
    for (const o of opts) {
        if (o === undefined) continue
        merge(Habit_DisplayOptionsSchema, result, o)
    }
    return result
}
