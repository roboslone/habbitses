import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { type Habit_DisplayOptions, Habit_DisplayOptionsSchema } from "@/proto/models/v1/models_pb"
import { clone, create } from "@bufbuild/protobuf"
import type React from "react"

interface P {
    options?: Habit_DisplayOptions
    onChange: (o: Habit_DisplayOptions) => void
}

const defaultOptions = create(Habit_DisplayOptionsSchema, {})

export const DisplayOptionsForm: React.FC<P> = ({ options = defaultOptions, onChange }) => {
    const update = (fn: (o: Habit_DisplayOptions) => void) => {
        const copy = clone(Habit_DisplayOptionsSchema, options)
        fn(copy)
        onChange(copy)
    }

    return (
        <>
            <div
                className="flex items-center justify-between gap-2 py-2"
                onClick={() => update((o) => (o.hideChart = !o.hideChart))}
            >
                <Label>Hide charts</Label>
                <Switch checked={options.hideChart} />
            </div>

            <div
                className="flex items-center justify-between gap-2 py-2"
                onClick={() => update((o) => (o.hideDescription = !o.hideDescription))}
            >
                <Label>Hide descriptions</Label>
                <Switch checked={options.hideDescription} />
            </div>

            <div
                className="flex items-center justify-between gap-2 py-2"
                onClick={() => update((o) => (o.hideProgressbar = !o.hideProgressbar))}
            >
                <Label>Hide progress</Label>
                <Switch checked={options.hideProgressbar} />
            </div>
        </>
    )
}
