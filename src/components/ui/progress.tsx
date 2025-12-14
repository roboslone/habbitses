import { useHabitContext } from "@/components/habit/context"
import { cn } from "@/lib/utils"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import * as React from "react"

function Progress({
    className,
    value,
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
    const { color } = useHabitContext()

    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                "dark:bg-primary/20 bg-primary/5 relative h-1 w-full overflow-hidden",
                className,
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className={cn("bg-primary h-full w-full flex-1 transition-all", color.background)}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    )
}

export { Progress }
