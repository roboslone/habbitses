import type { RepoContent } from "@/lib/git"
import React from "react"

interface S {
    repoContent: RepoContent
    isFetching: boolean
}

export const RepoContentContext = React.createContext<S | undefined>(undefined)

export const useRepoContentContext = () => {
    const ctx = React.useContext(RepoContentContext)
    if (ctx === undefined) throw new Error("repo content unavailable")
    return ctx
}
