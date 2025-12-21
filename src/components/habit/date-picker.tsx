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
import { cn } from "@/lib/utils"
import { ArrowRight, CalendarSearch, Undo2 } from "lucide-react"
import React from "react"

import { useHabitContext } from "./context"

export const HabitDatePicker: React.FC = () => {
    const { selectedDate, setSelectedDate } = useHabitContext()
    const [open, setOpen] = React.useState(false)

    const handleSelect = (d: Date | undefined) => {
        setSelectedDate(d || new Date())
        setOpen(false)
    }

    return (
        <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="w-fit">
                            <CalendarSearch
                                className={cn({ "text-amber-600": selectedDate !== undefined })}
                            />
                            {selectedDate === undefined
                                ? "Today"
                                : selectedDate?.toLocaleDateString()}
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
                        selected={selectedDate}
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
                                setSelectedDate(new Date())
                                setOpen(false)
                            }}
                        >
                            <ArrowRight />
                            Today
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button
                variant="ghost"
                size="sm"
                className="w-fit"
                disabled={selectedDate === undefined}
                onClick={() => setSelectedDate(undefined)}
            >
                <Undo2 />
            </Button>
        </div>
    )
}
