import { DateContext } from "@/components/date/context"
import { useHabitContext } from "@/components/habit/context"
import { formatDate } from "@/lib/dates"
import { cn } from "@/lib/utils"
import { type Completion } from "@/proto/models/v1/models_pb"
import React from "react"

import { HabitDatePicker } from "./date-picker"

const rows = Array.from(Array(7).keys())
const columns = Array.from(Array(53).keys())

const day = 24 * 60 * 60 * 1000

const cellToDate = (now: Date, row: number, column: number): Date => {
    const delta = row + column * 7
    return new Date(now.getTime() - delta * day)
}

interface CellProps {
    row: number
    column: number
    date: Date
    background: string
    interactive: boolean
    completion?: Completion
    selected?: boolean
}

const Cell: React.FC<CellProps> = ({ date, background, completion, selected, interactive }) => {
    const { setSelectedDate } = useHabitContext()

    let progress = 0
    if (completion !== undefined) {
        progress = Math.min(1, completion.count / completion.target)
    }

    return (
        <div
            className={cn("w-3 h-3 min-w-3 min-h-3 rounded-xs flex items-center justify-center", {
                "cursor-pointer": interactive,
                "bg-secondary dark:bg-card/80": progress === 0,
                [background]: progress > 0,
            })}
            style={{
                opacity: progress === 0 ? 1 : progress,
            }}
            onClick={interactive ? () => setSelectedDate(date) : undefined}
        >
            {interactive && selected && <div className="h-2 w-2 rounded-xs bg-secondary" />}
        </div>
    )
}

interface P {
    interactive?: boolean
}

export const HabitChart: React.FC<P> = ({ interactive }) => {
    const today = React.useContext(DateContext)
    const { habit, color, selectedDate } = useHabitContext()
    const now = new Date()
    const selectedDateStr = formatDate(selectedDate ?? today)

    return (
        <div className="flex flex-col gap-2">
            <div className="max-w-full overflow-auto">
                <div data-testid={`habit-chart--${habit.name}`} className="flex flex-col gap-1">
                    {rows.map((row) => (
                        <div key={row} className="flex gap-1">
                            {columns.map((column) => {
                                const date = cellToDate(now, row, column)
                                const dateStr = formatDate(date)
                                return (
                                    <Cell
                                        key={`${row}-${column}`}
                                        row={row}
                                        column={column}
                                        date={date}
                                        background={color.background}
                                        completion={habit.completions[dateStr]}
                                        selected={dateStr === selectedDateStr}
                                        interactive={!!interactive}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">{interactive && <HabitDatePicker />}</div>
        </div>
    )
}
