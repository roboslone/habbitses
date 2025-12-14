import type { Repo } from "@/lib/git"
import React from "react"

export const RepoContext = React.createContext<Repo | undefined>(undefined)

export const useRepoContext = () => {
    const ctx = React.useContext(RepoContext)
    if (ctx === undefined) throw new Error("repo context unavailable")
    return ctx
}
