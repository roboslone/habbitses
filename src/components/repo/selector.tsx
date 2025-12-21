import { RepoPicker } from "@/components/repo/picker"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { type Repo, useSelectedRepo } from "@/lib/git"
import { BookMarked, ChevronsUpDown, Trash2 } from "lucide-react"
import React from "react"

export const RepoSelector: React.FC = () => {
    const [repo, setRepo] = useSelectedRepo()
    const [open, setOpen] = React.useState(false)

    const handlePick = (r: Repo) => {
        setRepo(r)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="w-full flex items-center gap-2">
                <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="justify-between grow">
                        {repo === undefined ? (
                            <span className="text-muted-foreground">Repository not selected</span>
                        ) : (
                            <div className="flex items-center gap-2">
                                <BookMarked className="text-emerald-600" />
                                {repo.name}
                            </div>
                        )}
                        <ChevronsUpDown />
                    </Button>
                </DialogTrigger>
                <Button variant="outline" size="lg" onClick={() => setRepo(undefined)}>
                    <Trash2 />
                </Button>
            </div>
            <DialogContent>
                <DialogTitle>Select a repository</DialogTitle>
                <DialogDescription>
                    Pick a <strong>private</strong> repository to store your habit data.
                </DialogDescription>
                <div className="h-[50vh]">
                    <RepoPicker onPick={handlePick} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
