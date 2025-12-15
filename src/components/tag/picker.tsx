import { useCollectionContext } from "@/components/collection/context"
import { useHabitContext } from "@/components/habit/context"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog"
import { HabitSchema } from "@/proto/models/v1/models_pb"
import { clone } from "@bufbuild/protobuf"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Link } from "@tanstack/react-router"
import { Check, Ellipsis, Loader2, Plus, Undo2 } from "lucide-react"
import React from "react"
import { toast } from "sonner"

import { TagContext } from "./context"
import { TagList } from "./list"

export const TagPicker: React.FC = () => {
    const { tags } = useCollectionContext()
    const { habit, update } = useHabitContext()

    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<Set<string>>(new Set(habit.tagNames))

    const toggleTag = (name: string) => {
        const next = new Set(selected)
        if (next.has(name)) {
            next.delete(name)
        } else {
            next.add(name)
        }
        setSelected(next)
    }

    const handleCancel = () => {
        setOpen(false)
        setSelected(new Set(habit.tagNames))
    }

    const handleSubmit = () => {
        const copy = clone(HabitSchema, habit)
        copy.tagNames = [...selected].sort()

        toast.promise(
            update.mutateAsync(copy).then(() => setOpen(false)),
            {
                error: (e: Error) => ({ message: "Habit update failed", description: e.message }),
            },
        )
    }

    return (
        <div data-testid="tag-picker" className="flex items-center gap-1 flex-wrap">
            <TagList tags={habit.tagNames}>
                <TagContext value={{ active: selected, onClick: toggleTag }}>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-fit">
                                <Ellipsis />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Update tags</DialogTitle>
                            <DialogDescription>Select tags for this habit</DialogDescription>

                            {tags.length === 0 ? (
                                <div className="p-2 flex justify-center items-center flex-col gap-2">
                                    <span className="text-muted-foreground">
                                        You don't have any tags yet
                                    </span>

                                    <Link to="/tags/new">
                                        <Button>
                                            <Plus />
                                            Create tag
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="py-4">
                                        <TagList tags={tags} />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={update.isPending}
                                        >
                                            <Undo2 />
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="outline"
                                            disabled={update.isPending}
                                            onClick={handleSubmit}
                                        >
                                            {update.isPending ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                <Check className="text-emerald-600" />
                                            )}
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </TagContext>
            </TagList>
        </div>
    )
}
