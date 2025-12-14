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
    const [saturation, setSaturation] = useLocalStorage("habbitses/saturation/v1", 100)

    React.useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")
        root.style.filter = `saturate(${(saturation / 100).toFixed(2)})`

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme, saturation])

    return (
        <ThemeContext.Provider
            {...props}
            value={{
                theme,
                setTheme,
                saturation,
                setSaturation,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}
