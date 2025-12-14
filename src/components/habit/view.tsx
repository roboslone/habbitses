import { useHabitContext } from "@/components/habit/context"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useSelectedRepo } from "@/lib/git"
import { cn } from "@/lib/utils"
import { Completion_ButtonOptionsSchema } from "@/proto/models/v1/models_pb"
import { create } from "@bufbuild/protobuf"
import { History, Pencil, RefreshCw, Trash2 } from "lucide-react"
import React from "react"

import { HabitBreakDialog } from "./break-dialog"
import { CompletionButton } from "./button"
import { ButtonForm } from "./button-form"
import { CompletionButtons } from "./buttons"
import { HabitChart } from "./chart"
import { HabitDescription } from "./description"
import { FileButton } from "./file-button"
import HabitForm from "./form"
import { HabitIcon } from "./icon"
import { HabitProgress } from "./progress"

export const HabitView: React.FC = () => {
    const [repo] = useSelectedRepo()
    const [editMode, setEditMode] = React.useState(false)

    const { habit, update, color, completion, refetch, isFetching } = useHabitContext()

    const historyURL = `https://github.com/${repo?.full_name}/commits/main/habits/${habit.name}.json`

    let content = (
        <>
            <div className="flex items-center gap-2 flex-wrap">
                <CompletionButtons variant="outline" />
                <ButtonForm />
            </div>

            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground/50">Description</Label>
                <HabitDescription />
            </div>

            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground/50">Progress</Label>
                <div className="flex items-center justify-between">
                    <span>
                        {completion.count} / {completion.target}
                    </span>
                    <CompletionButton
                        options={create(Completion_ButtonOptionsSchema, {})}
                        className="w-fit"
                        size="sm"
                    />
                </div>
                <HabitProgress className="rounded-full h-1.5" />
            </div>

            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground/50">Chart</Label>
                <div className="max-w-full overflow-auto">
                    <HabitChart />
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
                <Button variant="ghost" onClick={() => void refetch()} disabled={isFetching}>
                    <RefreshCw className={cn({ "animate-spin": isFetching })} />
                    Refresh
                </Button>

                <HabitBreakDialog>
                    <Button variant="ghost" onClick={() => setEditMode(true)}>
                        <Pencil />
                        Edit
                    </Button>
                </HabitBreakDialog>

                <HabitBreakDialog>
                    <Button variant="ghost">
                        <Trash2 />
                        Break
                    </Button>
                </HabitBreakDialog>

                <FileButton name={habit.name} />

                <a href={historyURL} target="_blank">
                    <Button variant="ghost">
                        <History />
                        History
                    </Button>
                </a>
            </div>
        </>
    )
    if (editMode) {
        content = (
            <HabitForm
                value={habit}
                onChange={(h) => update.mutateAsync(h).then(() => setEditMode(false))}
                onCancel={() => setEditMode(false)}
            />
        )
    }

    return (
        <div data-testid={`habit-view--${habit.name}`} className="truncate max-w-full">
            <PageHeader
                title={
                    <div className={cn("flex items-center gap-2", color.text)}>
                        <HabitIcon size={18} />
                        {habit.name}
                    </div>
                }
            />

            <div className="flex justify-center">
                <div className="flex flex-col gap-5 w-full px-4 max-w-211">{content}</div>
            </div>
        </div>
    )
}
