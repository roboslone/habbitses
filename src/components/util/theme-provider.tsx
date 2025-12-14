import React from "react"
import useLocalStorage from "use-local-storage"

import { type Theme, ThemeContext } from "./theme-context"

interface P {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export const ThemeProvider: React.FC<P> = ({ children, ...props }) => {
    const [theme, setTheme] = useLocalStorage<Theme>("habbitses/theme/v1", "system")

    React.useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        setTheme,
    }

    return (
        <ThemeContext.Provider {...props} value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
