import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const randomArrayElement = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)]
