import { useHabitContext } from "@/components/habit/context"
import { useStoredDisplayOptions } from "@/lib/displayOptions"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import type React from "react"

import { CompletionButtons } from "./buttons"
import { HabitChart } from "./chart"
import { HabitIcon } from "./icon"
import { HabitProgress } from "./progress"

export const HabitCard: React.FC = () => {
    const { habit, color, isCompleted } = useHabitContext()
    const [displayOptions] = useStoredDisplayOptions()

    return (
        <div
            className={cn("habit-card rounded truncate w-full max-w-211 flex flex-col gap-1", {
                "min-h-40": !displayOptions.hideChart,
            })}
        >
            <div
                className={cn(
                    "habit-card--header",
                    "flex flex-col gap-1 bg-card rounded truncate",
                    color.text,
                    { "pt-1": !displayOptions.hideProgressbar },
                )}
            >
                <div
                    className={cn("flex items-center gap-1 w-full px-2 pl-3 min-h-11", {
                        "opacity-40": isCompleted,
                    })}
                >
                    <Link to="/habits/$name" params={{ name: habit.name }} className="grow">
                        <div className="flex items-center gap-3 grow">
                            <HabitIcon size={20} className="w-6" />

                            <div className="flex flex-col gap-0">
                                <span
                                    className={cn({
                                        "line-through": isCompleted,
                                    })}
                                >
                                    {habit.name}
                                </span>

                                {!displayOptions.hideDescription && (
                                    <span className="text-xs text-stone-500">
                                        {habit.description}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>

                    <div className="ml-auto flex items-center gap-1 overflow-hidden">
                        <CompletionButtons max={2} />
                    </div>
                </div>

                {!displayOptions.hideProgressbar && <HabitProgress className="opacity-50" />}
            </div>

            {!displayOptions.hideChart && <HabitChart />}
        </div>
    )
}
