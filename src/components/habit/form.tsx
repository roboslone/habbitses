import ColorPicker from "@/components/color-picker"
import IconPicker from "@/components/icon-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import * as colors from "@/lib/colors"
import * as icons from "@/lib/icons"
import { useRefetchRepoContent } from "@/lib/queries"
import { randomArrayElement } from "@/lib/utils"
import { type Habit, HabitSchema } from "@/proto/models/v1/models_pb"
import { clone, create } from "@bufbuild/protobuf"
import { useNavigate } from "@tanstack/react-router"
import { Check, Loader2 } from "lucide-react"
import React from "react"
import { toast } from "sonner"

interface P {
    value?: Habit
    onChange: (h: Habit) => Promise<unknown>
}

const empty = (): Habit =>
    create(HabitSchema, {
        dailyTarget: 1,
        color: randomArrayElement(colors.all),
        icon: randomArrayElement(icons.all),
    })

export const HabitForm: React.FC<P> = ({ value, onChange }) => {
    const [loading, setLoading] = React.useState(false)
    const [habit, setHabit] = React.useState<Habit>(value ?? empty())
    const navigate = useNavigate()
    const refetchRepoContent = useRefetchRepoContent()

    const update = (fn: (h: Habit) => void) => {
        const next = clone(HabitSchema, habit)
        fn(next)
        setHabit(next)
    }

    const valid = !!habit.name

    const handleSubmit = () => {
        setLoading(true)
        onChange(habit)
            .then(async () => {
                const icon = <Check size={16} className="text-emerald-600" />
                if (value === undefined) {
                    toast.success("New habit emerges!", {
                        description: habit.name,
                        icon,
                    })
                    await refetchRepoContent()
                    await navigate({ to: "/" })
                } else {
                    toast.success("Habit updated", { description: habit.name, icon })
                }
            })
            .catch((e: Error) => {
                toast.error(value === undefined ? "Failed to start a habit" : "Update failed", {
                    description: e.message,
                })
            })
            .finally(() => setLoading(false))
    }

    return (
        <div data-testid="new-habit-form" className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-2">
                {value === undefined ? <Label aria-required>Name *</Label> : <Label>Name</Label>}
                <Input
                    autoFocus
                    disabled={loading || value !== undefined}
                    value={habit.name}
                    onChange={(e) => update((h) => (h.name = e.target.value.trim()))}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Input
                    disabled={loading}
                    value={habit.description}
                    onChange={(e) => update((h) => (h.description = e.target.value.trim()))}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Daily target</Label>
                <p className="text-xs text-muted-foreground">
                    For example, number of book pages to read.
                </p>
                <Input
                    type="number"
                    disabled={loading}
                    value={habit.dailyTarget}
                    onChange={(e) =>
                        update((h) => (h.dailyTarget = Math.max(1, e.target.valueAsNumber || 0)))
                    }
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Color</Label>
                <ColorPicker
                    disabled={loading}
                    active={habit.color}
                    onPick={(color) => update((h) => (h.color = color))}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Icon</Label>
                <IconPicker
                    disabled={loading}
                    active={habit.icon}
                    color={habit.color}
                    onPick={(icon) => update((h) => (h.icon = icon))}
                />
            </div>

            <Separator />

            <div className="flex items-center gap-2 justify-center">
                <Button
                    variant="outline"
                    size="lg"
                    disabled={!valid || loading}
                    onClick={handleSubmit}
                    className="w-full max-w-lg"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Check style={{ color: `var(--color-${habit.color}-400)` }} />
                    )}
                    Start a habit
                </Button>
            </div>
        </div>
    )
}

export default HabitForm
