import {
    Apple,
    CircleQuestionMark,
    Dumbbell,
    Hammer,
    Heart,
    type LucideIcon,
    type LucideProps,
    MoonStar,
    Pill,
    Star,
    Tablets,
    Tag,
    Trophy,
    Wallet,
} from "lucide-react"
import React from "react"

export const icons: Record<string, LucideIcon> = {
    CircleQuestionMark,
    Apple,
    Wallet,
    Hammer,
    Star,
    MoonStar,
    Trophy,
    Dumbbell,
    Pill,
    Tablets,
    Tag,
    Heart,
}

export type Key = keyof typeof icons

export const all: Key[] = Object.keys(icons)

export const fromString = (s?: string): Key => {
    if (s === undefined || icons[s] === undefined) return "CircleQuestionMark"
    return s
}

export const render = (key?: string, props?: LucideProps): React.ReactNode =>
    React.createElement(icons[fromString(key)], props)
