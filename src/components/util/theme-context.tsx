import React from "react"

export type Theme = "dark" | "light" | "system"

interface S {
    theme: Theme
    setTheme: (theme: Theme) => void
    saturation: number
    setSaturation: (v: number) => void
}

export const ThemeContext = React.createContext<S>({
    theme: "system",
    setTheme: () => null,
    saturation: 100,
    setSaturation: () => null,
})
