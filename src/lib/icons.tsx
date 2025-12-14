import {
    Activity,
    Apple,
    Bath,
    Bike,
    Biohazard,
    BookMarked,
    ChefHat,
    CircleQuestionMark,
    Clock,
    Coffee,
    Command,
    Cookie,
    Disc3,
    Dumbbell,
    Flame,
    Flower,
    GraduationCap,
    Hamburger,
    Hammer,
    Heart,
    ListCheck,
    type LucideIcon,
    type LucideProps,
    MoonStar,
    Music,
    Pill,
    Smile,
    Star,
    Tablets,
    Tag,
    Trash,
    Trophy,
    Utensils,
    Wallet,
    WashingMachine,
} from "lucide-react"
import React from "react"

export const icons: Record<string, LucideIcon> = {
    Activity,
    Apple,
    Bath,
    Bike,
    Biohazard,
    BookMarked,
    ChefHat,
    CircleQuestionMark,
    Clock,
    Coffee,
    Command,
    Cookie,
    Disc3,
    Dumbbell,
    Flame,
    Flower,
    GraduationCap,
    Hamburger,
    Hammer,
    Heart,
    ListCheck,
    MoonStar,
    Music,
    Pill,
    Smile,
    Star,
    Tablets,
    Tag,
    Trash,
    Trophy,
    Utensils,
    Wallet,
    WashingMachine,
}

export type Key = keyof typeof icons

export const all: Key[] = Object.keys(icons)

export const fromString = (s?: string): Key => {
    if (s === undefined || icons[s] === undefined) return "CircleQuestionMark"
    return s
}

export const render = (key?: string, props?: LucideProps): React.ReactNode =>
    React.createElement(icons[fromString(key)], props)
