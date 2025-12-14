import React from "react"

export type Theme = "dark" | "light" | "system"

interface S {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const ThemeContext = React.createContext<S>({
    theme: "system",
    setTheme: () => null,
})
