import type { RepoContent } from "@/lib/git"
import React from "react"

export const RepoContentContext = React.createContext<RepoContent | undefined>(undefined)

export const useRepoContentContext = () => {
    const ctx = React.useContext(RepoContentContext)
    if (ctx === undefined) throw new Error("repo content unavailable")
    return ctx
}
