import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Check, Undo2 } from "lucide-react"
import React from "react"

interface P extends React.PropsWithChildren {
    onSubmit: (v: number) => void
}

export const ManualCompletionDialog: React.FC<P> = ({ children, onSubmit }) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(0)

    const handleSubmit = () => {
        onSubmit(value)
        setOpen(false)
        setValue(0)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogTitle>Manual update</DialogTitle>
                <DialogDescription>Set a value for manual update</DialogDescription>

                <Input
                    type="number"
                    inputMode="numeric"
                    value={value}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setValue(e.target.valueAsNumber || 0)}
                />

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        <Undo2 />
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={handleSubmit}>
                        <Check className="text-emerald-600" />
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
