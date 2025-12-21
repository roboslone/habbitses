import { DateContext } from "@/components/date/context"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { timestampDate } from "@bufbuild/protobuf/wkt"
import { CalendarClock } from "lucide-react"
import React from "react"

import { useHabitContext } from "./context"

export const HabitHistory: React.FC = () => {
    const today = React.useContext(DateContext)
    const { completion, selectedDate } = useHabitContext()

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" disabled={completion.events.length === 0}>
                    <CalendarClock />
                    Events
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Completion History</DialogTitle>
                <DialogDescription>
                    {(selectedDate ?? today).toLocaleDateString()}
                </DialogDescription>

                {completion.events.length === 0 && (
                    <div className="flex justify-center pt-4 text-muted-foreground">
                        No events recorded yet.
                    </div>
                )}

                <ul>
                    {completion.events.map((e, idx) => (
                        <li key={idx}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span>{e.previousCount}</span>
                                    <span className="text-muted-foreground">→</span>
                                    <span>{e.count}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {e.time === undefined
                                        ? "Time not recorded"
                                        : timestampDate(e.time).toLocaleString()}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    )
}
