import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    type Completion_ButtonOptions,
    Completion_ButtonOptionsSchema,
    HabitSchema,
} from "@/proto/models/v1/models_pb"
import { clone, create } from "@bufbuild/protobuf"
import { Check, Loader2, X } from "lucide-react"
import React from "react"

import { CompletionButton } from "./button"
import { useHabitContext } from "./context"

interface P {
    onClose: () => void
}

type Case = Completion_ButtonOptions["kind"]["case"]

export const NewButtonForm: React.FC<P> = ({ onClose }) => {
    const { habit, update } = useHabitContext()

    const [case_, setCase] = React.useState<Case>("delta")
    const [options, setOptions] = React.useState<Completion_ButtonOptions>(
        create(Completion_ButtonOptionsSchema, {
            kind: { case: "delta", value: 10 },
        }),
    )

    const handleSubmit = () => {
        const copy = clone(HabitSchema, habit)
        if (copy.buttons === undefined) {
            copy.buttons = []
        }
        copy.buttons.push(clone(Completion_ButtonOptionsSchema, options))
        void update.mutateAsync(copy).then(onClose)
    }

    let preview = null
    switch (case_) {
        case "complete":
            preview = <CompletePreview setOptions={setOptions} />
            break
        case "delta":
            preview = (
                <NumericPreview
                    key={case_}
                    description="Increase progress by specified amount"
                    setOptions={setOptions}
                    toOptions={(value) =>
                        create(Completion_ButtonOptionsSchema, { kind: { case: case_, value } })
                    }
                />
            )
            break
        case "percentage":
            preview = (
                <NumericPreview
                    key={case_}
                    description="Increase progress by specified percentage"
                    setOptions={setOptions}
                    toOptions={(value) =>
                        create(Completion_ButtonOptionsSchema, { kind: { case: case_, value } })
                    }
                />
            )
            break
        case "set":
            preview = (
                <NumericPreview
                    key={case_}
                    description="Set progress to specified value"
                    setOptions={setOptions}
                    toOptions={(value) =>
                        create(Completion_ButtonOptionsSchema, { kind: { case: case_, value } })
                    }
                />
            )
            break
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Label>Variant</Label>
                <Select value={case_} onValueChange={(v) => setCase(v as unknown as Case)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select button type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="complete">Complete</SelectItem>
                        <SelectItem value="set">Set</SelectItem>
                        <SelectItem value="delta">Delta</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            {preview}

            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Result</Label>
                <CompletionButton preview variant="outline" options={options} />
            </div>

            <Separator />

            <DialogFooter>
                <Button variant="outline" onClick={onClose} className="grow">
                    <X />
                    Cancel
                </Button>
                <Button
                    variant="outline"
                    className="grow"
                    disabled={update.isPending}
                    onClick={handleSubmit}
                >
                    {update.isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Check className="text-emerald-600" />
                    )}
                    Add
                </Button>
            </DialogFooter>
        </div>
    )
}

interface SubProps {
    setOptions: (o: Completion_ButtonOptions) => void
}

const CompletePreview: React.FC<SubProps> = ({ setOptions }) => {
    React.useEffect(() => {
        setOptions(
            create(Completion_ButtonOptionsSchema, {
                kind: { case: "complete", value: true },
            }),
        )
    }, [setOptions])

    return (
        <>
            <p className="text-muted-foreground">
                Set progress to the target value, instantly completing the habit
            </p>
        </>
    )
}

interface NumericPreviewProps extends SubProps {
    description: string
    max?: number
    toOptions: (v: number) => Completion_ButtonOptions
}

const NumericPreview: React.FC<NumericPreviewProps> = ({
    description,
    max,
    toOptions,
    setOptions,
}) => {
    const [value, setValue] = React.useState(42)

    React.useEffect(() => {
        setOptions(toOptions(value))
    }, [setOptions, value])

    return (
        <>
            <p className="text-muted-foreground">{description}</p>

            <div className="flex flex-col gap-2">
                <Label>Value</Label>
                <Input
                    type="number"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => {
                        let v = Math.max(0, e.target.valueAsNumber || 0)
                        if (max !== undefined) {
                            v = Math.min(max, v)
                        }
                        setValue(v)
                    }}
                />
                <span className="text-xs text-muted-foreground">
                    If{" "}
                    <a className="underline cursor-pointer" onClick={() => setValue(0)}>
                        zero
                    </a>
                    , value will be set manually each time.
                </span>
            </div>
        </>
    )
}
