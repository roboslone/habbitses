import { useHabitContext } from "@/components/habit/context"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/dates"
import { cn } from "@/lib/utils"
import {
    type Completion,
    CompletionSchema,
    type Completion_ButtonOptions,
    Completion_ButtonOptionsSchema,
    HabitSchema,
} from "@/proto/models/v1/models_pb"
import { clone, create } from "@bufbuild/protobuf"
import { ArrowRight, Check, Plus, Undo2 } from "lucide-react"
import React from "react"
import { toast } from "sonner"

import { ManualCompletionDialog } from "./manual-completion-dialog"

interface P extends React.ComponentProps<typeof Button> {
    options?: Completion_ButtonOptions
    preview?: boolean
}

const defaultOptions = create(Completion_ButtonOptionsSchema, {
    kind: { case: "complete", value: true },
})

const applyButton = (
    completion: Completion,
    options: Completion_ButtonOptions,
    manualValue?: number,
) => {
    console.info("apply button", { completion, options, manualValue })

    switch (options.kind.case) {
        case "delta":
            completion.count += manualValue ?? options.kind.value
            return
        case "percentage":
            completion.count += Math.ceil(
                ((manualValue ?? options.kind.value) / 100) * completion.target,
            )
            return
        case "complete":
            completion.count = completion.target
            return
        case "set":
            completion.count = manualValue ?? options.kind.value
            return
    }
}

export const CompletionButton: React.FC<P> = ({ options = defaultOptions, preview, ...rest }) => {
    const { habit, color, update } = useHabitContext()

    const handleClick = (manualValue?: number) => {
        if (preview) return

        const next = clone(HabitSchema, habit)
        const date = formatDate(new Date())

        if (options.kind.case === undefined) {
            delete next.completions[date]
        } else {
            const completion =
                next.completions[date] ?? create(CompletionSchema, { target: next.dailyTarget })

            applyButton(completion, options, manualValue)
            next.completions[date] = completion
        }

        toast.promise(update.mutateAsync(next), {
            error: (e: Error) => ({
                message: "Update failed",
                description: e.message,
            }),
        })
    }

    const { kind = defaultOptions.kind } = options
    let className = cn(color.text, rest.className)

    let content = null
    if (kind.case === undefined) {
        content = (
            <>
                <Undo2 />
                <span>Reset</span>
            </>
        )
    } else if (kind.case === "complete") {
        content = (
            <>
                <Check />
                Done
            </>
        )
    } else if (kind.case === "delta") {
        if (kind.value === 0) {
            return (
                <ManualCompletionDialog onSubmit={handleClick}>
                    <Button
                        variant="ghost"
                        {...rest}
                        className={className}
                        disabled={rest.disabled || update.isPending}
                    >
                        <Plus />
                        Add
                    </Button>
                </ManualCompletionDialog>
            )
        }

        className = cn(className, "gap-1")
        content = (
            <>
                <Plus />
                <span>{kind.value}</span>
            </>
        )
    } else if (kind.case === "percentage") {
        className = cn(className, "gap-1")
        content = (
            <>
                <Plus />
                <span>{kind.value}%</span>
            </>
        )

        if (kind.value === 0) {
            return (
                <ManualCompletionDialog onSubmit={handleClick}>
                    <Button
                        variant="ghost"
                        {...rest}
                        className={className}
                        disabled={rest.disabled || update.isPending}
                    >
                        <Plus />
                        Add %
                    </Button>
                </ManualCompletionDialog>
            )
        }
    } else if (kind.case === "set") {
        if (kind.value === 0) {
            return (
                <ManualCompletionDialog onSubmit={handleClick}>
                    <Button
                        variant="ghost"
                        {...rest}
                        className={className}
                        disabled={rest.disabled || update.isPending}
                    >
                        <ArrowRight />
                        Set
                    </Button>
                </ManualCompletionDialog>
            )
        }

        content = (
            <>
                <ArrowRight />
                {kind.value}
            </>
        )
    }

    return (
        <Button
            variant="ghost"
            {...rest}
            className={className}
            disabled={rest.disabled || update.isPending}
            onClick={() => handleClick()}
        >
            {content}
        </Button>
    )
}
