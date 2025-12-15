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
import { toast } from "sonner"

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

        toast.promise(update.mutateAsync(copy).then(onClose), {
            error: (e: Error) => ({
                message: "Failed to add button",
                description: e.message,
            }),
        })
    }

    let preview = null
    switch (case_) {
        case "complete":
            preview = <CompletePreview setOptions={setOptions} />
            break
        case "delta":
            preview = <DeltaPreview setOptions={setOptions} />
            break
        case "percentage":
            preview = <PercentagePreview setOptions={setOptions} />
            break
        case "set":
            preview = <SetPreview setOptions={setOptions} />
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
                <Label>Result</Label>
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

const SetPreview: React.FC<SubProps> = ({ setOptions }) => {
    const [value, setValue] = React.useState(42)

    React.useEffect(() => {
        setOptions(
            create(Completion_ButtonOptionsSchema, {
                kind: { case: "set", value },
            }),
        )
    }, [setOptions, value])

    return (
        <>
            <p className="text-muted-foreground">Set progress to specified value</p>

            <div className="flex flex-col gap-2">
                <Label>Value</Label>
                <Input
                    type="number"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => setValue(Math.max(0, e.target.valueAsNumber || 0))}
                />
            </div>
        </>
    )
}

const DeltaPreview: React.FC<SubProps> = ({ setOptions }) => {
    const [value, setValue] = React.useState(42)

    React.useEffect(() => {
        setOptions(
            create(Completion_ButtonOptionsSchema, {
                kind: { case: "delta", value },
            }),
        )
    }, [setOptions, value])

    return (
        <>
            <p className="text-muted-foreground">Increase progress by specified amount</p>

            <div className="flex flex-col gap-2">
                <Label>Value</Label>
                <Input
                    type="number"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => setValue(Math.max(0, e.target.valueAsNumber || 0))}
                />
            </div>
        </>
    )
}

const PercentagePreview: React.FC<SubProps> = ({ setOptions }) => {
    const [value, setValue] = React.useState(42)

    React.useEffect(() => {
        setOptions(
            create(Completion_ButtonOptionsSchema, {
                kind: { case: "percentage", value },
            }),
        )
    }, [setOptions, value])

    return (
        <>
            <p className="text-muted-foreground">Increase progress by specified percentage</p>

            <div className="flex flex-col gap-2">
                <Label>Value</Label>
                <Input
                    type="number"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) =>
                        setValue(Math.min(100, Math.max(0, e.target.valueAsNumber || 0)))
                    }
                />
            </div>
        </>
    )
}
