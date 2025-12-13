import { Octokit } from "octokit"
import React from "react"

export const OctokitContext = React.createContext<Octokit>(new Octokit())

export const useOctokit = () => {
    const context = React.useContext(OctokitContext)
    if (!context) {
        throw new Error("octokit context not available")
    }
    return context
}
