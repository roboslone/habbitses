import { useCollectionContext } from "@/components/collection/context"
import ColorPicker from "@/components/color-picker"
import IconPicker from "@/components/icon-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import * as colors from "@/lib/colors"
import { formatDate } from "@/lib/dates"
import * as icons from "@/lib/icons"
import { randomArrayElement } from "@/lib/utils"
import { type Habit, HabitSchema } from "@/proto/models/v1/models_pb"
import { clone, create } from "@bufbuild/protobuf"
import { useNavigate } from "@tanstack/react-router"
import { AlertTriangle, Check, Loader2, X } from "lucide-react"
import React from "react"
import { toast } from "sonner"

interface P {
    value?: Habit
    onChange: (h: Habit) => Promise<unknown>
    onCancel?: () => void
}

const empty = (): Habit =>
    create(HabitSchema, {
        dailyTarget: 1,
        color: randomArrayElement(colors.all),
        icon: randomArrayElement(icons.all),
    })

export const HabitForm: React.FC<P> = ({ value, onChange, onCancel }) => {
    const { habits: habitNameSet } = useCollectionContext()

    const [loading, setLoading] = React.useState(false)
    const [habit, setHabit] = React.useState<Habit>(value ?? empty())
    const navigate = useNavigate()

    const update = (fn: (h: Habit) => void) => {
        const next = clone(HabitSchema, habit)
        fn(next)
        setHabit(next)
    }

    const updateDailyTarget = (v: number) => {
        const next = clone(HabitSchema, habit)
        next.dailyTarget = v

        const date = formatDate(new Date())
        if (next.completions[date] !== undefined) {
            next.completions[date].target = v
        }

        setHabit(next)
    }
    const valid = !!habit.name && (value !== undefined || !habitNameSet.has(habit.name))

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
        <div data-testid="habit-form" className="flex flex-col gap-5">
            {value === undefined && (
                <div className="flex flex-col gap-2">
                    <Label aria-required>Name *</Label>
                    <Input
                        autoFocus
                        disabled={loading}
                        value={habit.name}
                        onChange={(e) => update((h) => (h.name = e.target.value))}
                    />
                    {habitNameSet.has(habit.name) && (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertTriangle size={14} /> Habit already exists!
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Input
                    disabled={loading}
                    value={habit.description}
                    onChange={(e) => update((h) => (h.description = e.target.value))}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Daily target</Label>
                <p className="text-xs text-muted-foreground">
                    For example, number of book pages to read.
                </p>
                <Input
                    type="number"
                    inputMode="numeric"
                    disabled={loading}
                    value={habit.dailyTarget}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => updateDailyTarget(e.target.valueAsNumber || 0)}
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

            <div className="flex flex-col items-center gap-2 justify-center">
                <Button
                    size="lg"
                    disabled={!valid || loading}
                    onClick={handleSubmit}
                    className="w-full max-w-lg"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Check />}
                    {value === undefined ? "Start a habit" : "Save"}
                </Button>

                {onCancel !== undefined && (
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onCancel}
                        className="w-full max-w-lg"
                    >
                        <X />
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    )
}

export default HabitForm
