import { useHabitContext } from "@/components/habit/context"
import { useOrderingContext } from "@/components/ordering/context"
import { TagContext } from "@/components/tag/context"
import { useStoredDisplayOptions } from "@/lib/displayOptions"
import { cn } from "@/lib/utils"
import type { Habit } from "@/proto/models/v1/models_pb"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Link } from "@tanstack/react-router"
import React from "react"

import { CompletionButtons } from "./buttons"
import { HabitChart } from "./chart"
import { HabitIcon } from "./icon"
import { HabitProgress } from "./progress"

const matchActiveTags = (h: Habit, active?: Set<string>): boolean => {
    if (!active || active.size === 0) return true

    for (const tag of h.tagNames) {
        if (active.has(tag)) return true
    }
    return false
}

const LinkWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { isReordering } = useOrderingContext()
    const { habit } = useHabitContext()

    if (isReordering) {
        return children
    }

    return (
        <Link
            to="/habits/$name"
            params={{ name: habit.name }}
            className="flex flex-col justify-center grow h-full min-h-11 cursor-pointer"
        >
            {children}
        </Link>
    )
}

export const HabitCard: React.FC = () => {
    const tags = React.useContext(TagContext)
    const { habit, color, isCompleted } = useHabitContext()
    const { isReordering } = useOrderingContext()
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: habit.name,
    })
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    }
    const [displayOptions] = useStoredDisplayOptions()

    if (!matchActiveTags(habit, tags.active)) return null

    const extraProps = { ref: setNodeRef, style, ...attributes }

    return (
        <div
            {...extraProps}
            className={cn("habit-card rounded truncate w-full max-w-211 flex flex-col gap-1", {
                "min-h-40": !displayOptions.hideChart && !isReordering,
            })}
        >
            <div
                className={cn(
                    "habit-card--header",
                    "flex flex-col gap-1 dark:border-0 dark:bg-card rounded truncate",
                    color.text,
                    color.lightBackground,
                    { "pt-1": !displayOptions.hideProgressbar },
                    { "py-1": displayOptions.hideProgressbar },
                    { "opacity-50": isCompleted && !isReordering },
                )}
            >
                <div className={cn("flex items-center gap-1 w-full px-2 pl-3 min-h-11")}>
                    <LinkWrapper>
                        <div className="flex items-center gap-3 grow">
                            <HabitIcon size={20} className="w-6 touch-none" {...listeners} />

                            <div className="flex flex-col gap-0">
                                <span
                                    className={cn("max-w-120 overflow-hidden text-ellipsis", {
                                        "line-through": isCompleted && !isReordering,
                                    })}
                                    title={habit.name}
                                >
                                    {habit.name}
                                </span>

                                {!displayOptions.hideDescription && (
                                    <span
                                        className="max-w-120 overflow-hidden text-ellipsis text-xs text-muted-foreground dark:text-stone-500"
                                        title={habit.description}
                                    >
                                        {habit.description}
                                    </span>
                                )}
                            </div>
                        </div>
                    </LinkWrapper>

                    {isReordering ? (
                        <HabitIcon size={20} className="w-6 touch-none" {...listeners} />
                    ) : (
                        <div className="ml-auto flex items-center gap-1 overflow-hidden">
                            <CompletionButtons max={2} />
                        </div>
                    )}
                </div>

                {!displayOptions.hideProgressbar && <HabitProgress />}
            </div>

            {!displayOptions.hideChart && !isReordering && <HabitChart />}
        </div>
    )
}
