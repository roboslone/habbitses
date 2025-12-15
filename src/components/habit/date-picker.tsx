import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/dates"
import { ArrowRight, CalendarIcon, Undo2 } from "lucide-react"
import React from "react"

import { useHabitContext } from "./context"

export const HabitDatePicker: React.FC = () => {
    const { date, setDate } = useHabitContext()
    const [open, setOpen] = React.useState(false)

    const dateStr = formatDate(date)
    const todayStr = formatDate(new Date())

    const handleSelect = (d: Date | undefined) => {
        setDate(d || new Date())
        setOpen(false)
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                className="w-fit"
                disabled={dateStr === todayStr}
                onClick={() => setDate(new Date())}
            >
                <Undo2 />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="w-fit">
                            <CalendarIcon />
                            {date?.toLocaleDateString()}
                        </Button>
                    </div>
                </DialogTrigger>
                <DialogContent
                    className="w-fit truncate flex flex-col gap-2"
                    showCloseButton={false}
                >
                    <DialogTitle>Select date</DialogTitle>
                    <DialogDescription>Manage progress for the selected date</DialogDescription>

                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        weekStartsOn={1}
                        className="min-h-85"
                    />

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            <Undo2 />
                            Cancel
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setDate(new Date())
                                setOpen(false)
                            }}
                        >
                            <ArrowRight />
                            Today
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
