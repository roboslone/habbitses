import { Octokit } from "octokit"
import { toast } from "sonner"
import useLocalStorage from "use-local-storage"

export interface StoredToken {
    value: string
    expiresAt: Date
}

export interface StoredTokens {
    access: StoredToken
    refresh: StoredToken
}

export const useStoredTokens = () => {
    return useLocalStorage<StoredTokens | undefined>("habbitses/tokens/v1", undefined, {
        syncData: true,
    })
}

export interface StoredAccount {
    id: number
    login: string
    avatarURL: string
}

export const useStoredAccount = () => {
    return useLocalStorage<StoredAccount | undefined>("habbitses/username/v1", undefined, {
        syncData: true,
    })
}

export const resolveToken = async (token: string) => {
    const octokit = new Octokit({ auth: token })

    const user = await octokit.rest.users.getAuthenticated()
    toast.success("Logged in", { description: `Welcome, ${user.data.name}` })

    return { octokit, user }
}
