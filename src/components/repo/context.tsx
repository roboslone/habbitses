import type { Repo } from "@/lib/git"
import React from "react"

interface S {
    repo: Repo
    names: string[]
}

export const RepoContext = React.createContext<S | undefined>(undefined)

export const useRepoContext = () => {
    const ctx = React.useContext(RepoContext)
    if (ctx === undefined) throw new Error("repo context unavailable")
    return ctx
}
