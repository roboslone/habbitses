import type { Repo } from "@/lib/git"
import type { useRepoContent } from "@/lib/queries"
import React from "react"

interface S {
    repo: Repo
    content: ReturnType<typeof useRepoContent>
    names: string[]
}

export const RepoContext = React.createContext<S | undefined>(undefined)

export const useRepoContext = () => {
    const ctx = React.useContext(RepoContext)
    if (ctx === undefined) throw new Error("repo context unavailable")
    return ctx
}
