import type { Habit } from "@/proto/models/v1/models_pb"

export interface Options {
    text: string
    background: string
    border: string
}

export const index: Record<string, Options> = {
    neutral: {
        text: "text-neutral-400",
        background: "bg-neutral-400",
        border: "border-neutral-400",
    },
    red: { text: "text-red-400", background: "bg-red-400", border: "border-red-400" },
    orange: { text: "text-orange-400", background: "bg-orange-400", border: "border-orange-400" },
    amber: { text: "text-amber-400", background: "bg-amber-400", border: "border-amber-400" },
    yellow: { text: "text-yellow-400", background: "bg-yellow-400", border: "border-yellow-400" },
    lime: { text: "text-lime-400", background: "bg-lime-400", border: "border-lime-400" },
    green: { text: "text-green-400", background: "bg-green-400", border: "border-green-400" },
    emerald: {
        text: "text-emerald-400",
        background: "bg-emerald-400",
        border: "border-emerald-400",
    },
    teal: { text: "text-teal-400", background: "bg-teal-400", border: "border-teal-400" },
    cyan: { text: "text-cyan-400", background: "bg-cyan-400", border: "border-cyan-400" },
    sky: { text: "text-sky-400", background: "bg-sky-400", border: "border-sky-400" },
    indigo: { text: "text-indigo-400", background: "bg-indigo-400", border: "border-indigo-400" },
    violet: { text: "text-violet-400", background: "bg-violet-400", border: "border-violet-400" },
    purple: { text: "text-purple-400", background: "bg-purple-400", border: "border-purple-400" },
    fuchsia: {
        text: "text-fuchsia-400",
        background: "bg-fuchsia-400",
        border: "border-fuchsia-400",
    },
    pink: { text: "text-pink-400", background: "bg-pink-400", border: "border-pink-400" },
    rose: { text: "text-rose-400", background: "bg-rose-400", border: "border-rose-400" },
}

export const defaultOption = index["neutral"]

export type Key = keyof typeof index

export const all: Key[] = Object.keys(index)

export const fromString = (s?: string): Key => {
    if (!s || index[s] === undefined) return "neutral"
    return s
}

export const get = (s = ""): Options => index[fromString(s)]

export const forHabit = (h?: Habit): Options => get(h?.color)
