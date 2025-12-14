import { useCollectionContext } from "@/components/collection/context"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useDeleteTags } from "@/lib/queries"
import { Link } from "@tanstack/react-router"
import { Loader2, Plus, Trash2 } from "lucide-react"
import React from "react"
import { toast } from "sonner"

import { TagContext } from "./context"
import { TagList } from "./list"

export const TagListPage: React.FC = () => {
    const { tags } = useCollectionContext()
    const deleteTags = useDeleteTags()

    const [selected, setSelected] = React.useState<Set<string>>(new Set())

    const toggle = (name: string) => {
        const next = new Set(selected)
        if (next.has(name)) {
            next.delete(name)
        } else {
            next.add(name)
        }
        setSelected(next)
    }

    const handleSubmit = () =>
        toast.promise(deleteTags.mutateAsync([...selected]).then(() => setSelected(new Set())))

    return (
        <>
            <PageHeader
                title="Tags"
                buttonRight={
                    <Link to="/tags/new">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon-lg">
                                    <Plus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Create new tag</TooltipContent>
                        </Tooltip>
                    </Link>
                }
            />

            <div className="p-2 pt-0 flex flex-col gap-2">
                <TagContext value={{ active: selected, onClick: toggle }}>
                    <TagList tags={tags} />
                </TagContext>

                <div className="flex justify-center">
                    <Dialog>
                        <Button
                            variant="outline"
                            disabled={selected.size === 0 || deleteTags.isPending}
                            onClick={handleSubmit}
                        >
                            {deleteTags.isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <Trash2 />
                            )}
                            Delete selected
                        </Button>
                    </Dialog>
                </div>
            </div>
        </>
    )
}

export default TagListPage
