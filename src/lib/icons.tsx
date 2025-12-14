import {
    Activity,
    Apple,
    Bike,
    BookMarked,
    ChefHat,
    CircleQuestionMark,
    Clock,
    Command,
    Cookie,
    Disc3,
    Dumbbell,
    Flame,
    Hamburger,
    Hammer,
    Heart,
    type LucideIcon,
    type LucideProps,
    MoonStar,
    Music,
    Pill,
    Star,
    Tablets,
    Tag,
    Trophy,
    Utensils,
    Wallet,
} from "lucide-react"
import React from "react"

export const icons: Record<string, LucideIcon> = {
    Activity,
    Apple,
    Bike,
    BookMarked,
    ChefHat,
    CircleQuestionMark,
    Clock,
    Command,
    Cookie,
    Disc3,
    Dumbbell,
    Flame,
    Hamburger,
    Hammer,
    Heart,
    MoonStar,
    Music,
    Pill,
    Star,
    Tablets,
    Tag,
    Trophy,
    Utensils,
    Wallet,
}

export type Key = keyof typeof icons

export const all: Key[] = Object.keys(icons)

export const fromString = (s?: string): Key => {
    if (s === undefined || icons[s] === undefined) return "CircleQuestionMark"
    return s
}

export const render = (key?: string, props?: LucideProps): React.ReactNode =>
    React.createElement(icons[fromString(key)], props)
