import { type Key, all, index } from "@/lib/colors"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import type React from "react"

interface P {
    active?: string
    onPick: (v: Key) => void
    disabled?: boolean
}

export const ColorPicker: React.FC<P> = ({ active, onPick, disabled }) => (
    <div data-testid="color-picker" className="flex flex-wrap gap-2">
        {all.map((v) => (
            <button
                key={v}
                className={cn(
                    "rounded-md w-8 h-8 flex flex-col items-center justify-center cursor-pointer",
                    index[v].background,
                    { "opacity-80": disabled },
                )}
                onClick={() => {
                    if (!disabled) onPick(v)
                }}
            >
                {active === v && <Check className="text-background" />}
            </button>
        ))}
    </div>
)

export default ColorPicker
