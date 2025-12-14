import React from "react"

interface S {
    active: Set<string>
    onClick?: (name: string) => void
}

export const TagContext = React.createContext<S>({
    active: new Set(),
})
