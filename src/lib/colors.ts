import type { Habit } from "@/proto/models/v1/models_pb"

export interface Options {
    text: string
    background: string
    border: string
    lightBackground: string
}

export const index: Record<string, Options> = {
    neutral: {
        text: "text-neutral-600 dark:text-neutral-400",
        background: "bg-neutral-500 dark:bg-neutral-400",
        lightBackground: "bg-neutral-100/75",
        border: "border-neutral-500 dark:border-neutral-400",
    },
    red: {
        text: "text-red-600 dark:text-red-400",
        background: "bg-red-500 dark:bg-red-400",
        lightBackground: "bg-red-100/75",
        border: "border-red-500 dark:border-red-400",
    },
    orange: {
        text: "text-orange-600 dark:text-orange-400",
        background: "bg-orange-500 dark:bg-orange-400",
        lightBackground: "bg-orange-100/75",
        border: "border-orange-500 dark:border-orange-400",
    },
    amber: {
        text: "text-amber-600 dark:text-amber-400",
        background: "bg-amber-500 dark:bg-amber-400",
        lightBackground: "bg-amber-100/75",
        border: "border-amber-500 dark:border-amber-400",
    },
    yellow: {
        text: "text-yellow-600 dark:text-yellow-400",
        background: "bg-yellow-500 dark:bg-yellow-400",
        lightBackground: "bg-yellow-100/75",
        border: "border-yellow-500 dark:border-yellow-400",
    },
    lime: {
        text: "text-lime-600 dark:text-lime-400",
        background: "bg-lime-500 dark:bg-lime-400",
        lightBackground: "bg-lime-100/75",
        border: "border-lime-500 dark:border-lime-400",
    },
    green: {
        text: "text-green-600 dark:text-green-400",
        background: "bg-green-500 dark:bg-green-400",
        lightBackground: "bg-green-100/75",
        border: "border-green-500 dark:border-green-400",
    },
    emerald: {
        text: "text-emerald-600 dark:text-emerald-400",
        background: "bg-emerald-500 dark:bg-emerald-400",
        lightBackground: "bg-emerald-100/75",
        border: "border-emerald-500 dark:border-emerald-400",
    },
    teal: {
        text: "text-teal-600 dark:text-teal-400",
        background: "bg-teal-500 dark:bg-teal-400",
        lightBackground: "bg-teal-100/75",
        border: "border-teal-500 dark:border-teal-400",
    },
    cyan: {
        text: "text-cyan-600 dark:text-cyan-400",
        background: "bg-cyan-500 dark:bg-cyan-400",
        lightBackground: "bg-cyan-100/75",
        border: "border-cyan-500 dark:border-cyan-400",
    },
    sky: {
        text: "text-sky-600 dark:text-sky-400",
        background: "bg-sky-500 dark:bg-sky-400",
        lightBackground: "bg-sky-100/75",
        border: "border-sky-500 dark:border-sky-400",
    },
    indigo: {
        text: "text-indigo-600 dark:text-indigo-400",
        background: "bg-indigo-500 dark:bg-indigo-400",
        lightBackground: "bg-indigo-100/75",
        border: "border-indigo-500 dark:border-indigo-400",
    },
    violet: {
        text: "text-violet-600 dark:text-violet-400",
        background: "bg-violet-500 dark:bg-violet-400",
        lightBackground: "bg-violet-100/75",
        border: "border-violet-500 dark:border-violet-400",
    },
    purple: {
        text: "text-purple-600 dark:text-purple-400",
        background: "bg-purple-500 dark:bg-purple-400",
        lightBackground: "bg-purple-100/75",
        border: "border-purple-500 dark:border-purple-400",
    },
    fuchsia: {
        text: "text-fuchsia-600 dark:text-fuchsia-400",
        background: "bg-fuchsia-500 dark:bg-fuchsia-400",
        lightBackground: "bg-fuchsia-100/75",
        border: "border-fuchsia-500 dark:border-fuchsia-400",
    },
    pink: {
        text: "text-pink-600 dark:text-pink-400",
        background: "bg-pink-500 dark:bg-pink-400",
        lightBackground: "bg-pink-100/75",
        border: "border-pink-500 dark:border-pink-400",
    },
    rose: {
        text: "text-rose-600 dark:text-rose-400",
        background: "bg-rose-500 dark:bg-rose-400",
        lightBackground: "bg-rose-100/75",
        border: "border-rose-500 dark:border-rose-400",
    },
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
