import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HabitSchema } from "@/proto/models/v1/models_pb"
import { clone } from "@bufbuild/protobuf"
import { Ellipsis, Loader2, Plus, Trash2 } from "lucide-react"
import React from "react"
import { toast } from "sonner"

import { CompletionButton } from "./button"
import { useHabitContext } from "./context"
import { NewButtonForm } from "./new-button-form"

export const ButtonForm: React.FC = () => {
    const { habit, update } = useHabitContext()

    const [addMode, setAddMode] = React.useState(false)

    const handleDelete = (idx: number) => {
        const copy = clone(HabitSchema, habit)
        if (copy.buttons === undefined) {
            return
        }

        copy.buttons = copy.buttons.filter((_, i) => i !== idx)

        toast.promise(update.mutateAsync(copy), {
            error: (e: Error) => ({
                message: "Failed to delete button",
                description: e.message,
            }),
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <Ellipsis />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Manage habit buttons</DialogTitle>
                <DialogDescription>Add or delete custom buttons for this habit</DialogDescription>

                {addMode ? (
                    <NewButtonForm onClose={() => setAddMode(false)} />
                ) : (
                    <>
                        <div className="flex flex-col gap-2">
                            {habit.buttons.map((b, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-1">
                                    <CompletionButton options={b} preview variant="outline" />
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleDelete(idx)}
                                                disabled={update.isPending}
                                            >
                                                {update.isPending ? (
                                                    <Loader2 className="animate-spin" />
                                                ) : (
                                                    <Trash2 />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Delete</TooltipContent>
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setAddMode(true)}>
                                <Plus />
                                Add custom button
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
