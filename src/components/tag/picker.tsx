import { useCollectionContext } from "@/components/collection/context"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Link } from "@tanstack/react-router"
import { Check, Ellipsis, Plus, Undo2 } from "lucide-react"
import React from "react"

import { TagContext } from "./context"
import { TagList } from "./list"

interface P {
    value: string[]
    onChange: (tags: string[]) => void
}

export const TagPicker: React.FC<P> = ({ value, onChange }) => {
    const { tags } = useCollectionContext()

    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<Set<string>>(new Set(value))

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
        setSelected(new Set(value))
    }

    const handleSubmit = () => {
        const tags = [...selected]
        tags.sort()
        onChange(tags)
        setOpen(false)
    }

    return (
        <div data-testid="tag-picker" className="flex items-center gap-1 flex-wrap">
            <TagList tags={value}>
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
                                        <Button variant="outline" onClick={handleCancel}>
                                            <Undo2 />
                                            Cancel
                                        </Button>
                                        <Button variant="outline" onClick={handleSubmit}>
                                            <Check className="text-emerald-600" />
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
