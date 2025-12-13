import { useStoredAccountContext } from "@/components/auth/account-context"
import { useOctokit } from "@/components/util/octokit-provider"
import { ExchangeService } from "@/proto/github/v1/exchange_pb"
import { type Habit, HabitSchema } from "@/proto/models/v1/models_pb"
import { clone, fromJsonString, toJson } from "@bufbuild/protobuf"
import { createClient } from "@connectrpc/connect"
import { createGrpcWebTransport } from "@connectrpc/connect-web"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import type { Octokit, RequestError } from "octokit"
import { toast } from "sonner"

import { type StoredAccount, useStoredAccount } from "./auth"
import { type Repo, type RepoContent, useSelectedRepo, useStoredRepos } from "./git"

export const client = new QueryClient()

export const ExchangeClient = createClient(
    ExchangeService,
    createGrpcWebTransport({
        baseUrl: "https://robosl.one",
        defaultTimeoutMs: 30 * 1000,
        fetch: (input, init) => fetch(input, { ...init, credentials: "include" }),
    }),
)

interface RetryOptions {
    maxFailures?: number
}

const handleError =
    (op: string, options?: RetryOptions) =>
    (failureCount: number, error: Error): boolean => {
        toast.error(op, { description: error.message, closeButton: true })
        return failureCount < (options?.maxFailures ?? 3)
    }

export const useCurrentAccount = () => {
    const octokit = useOctokit()
    const [account, setAccount] = useStoredAccount()

    return useQuery({
        queryKey: ["accounts", "current"],
        queryFn: async ({ signal }) => {
            const response = await octokit.rest.users.getAuthenticated({
                request: { signal },
            })

            const account: StoredAccount = {
                id: response.data.id,
                login: response.data.login,
                avatarURL: response.data.avatar_url,
            }
            setAccount(account)
            return account
        },
        staleTime: Infinity,
        initialData: account,
        retry: handleError("GitHub authentication failed", { maxFailures: 1 }),
    })
}

export const useRepos = () => {
    const octokit = useOctokit()
    const [repos, setRepos] = useStoredRepos()

    return useQuery({
        queryKey: ["repos"],
        queryFn: async ({ signal }) => {
            const response = await octokit.rest.repos.listForAuthenticatedUser({
                visibility: "private",
                request: { signal },
                headers: { "If-None-Match": "" },
            })
            // todo: store response time as well
            setRepos(response.data)
            return response.data
        },
        staleTime: 60 * 1000,
        initialData: repos,
        retry: handleError("Failed to fetch repos"),
    })
}

export const useRepoContent = (repo?: Repo, force = false) => {
    const account = useStoredAccountContext()
    const octokit = useOctokit()

    return useQuery({
        queryKey: ["repo", repo?.id, "content"],
        queryFn: async ({ signal }) => {
            if (!repo || (!force && repo.size === 0)) {
                return {
                    sha: "",
                    truncated: false,
                    tree: [],
                } as RepoContent
            }

            try {
                const response = await octokit.rest.git.getTree({
                    owner: account.login,
                    repo: repo.name,
                    tree_sha: "HEAD",
                    recursive: "true",
                    request: { signal },
                    headers: force ? { "If-None-Match": "" } : undefined,
                })
                return response.data
            } catch (e: unknown) {
                if ((e as RequestError).status === 404 || (e as RequestError).status === 409) {
                    // empty repo
                    return {
                        sha: "",
                        truncated: false,
                        tree: [],
                    } as RepoContent
                }
                throw e
            }
        },
        staleTime: 5 * 60 * 1000, // todo
        retry: handleError("Failed to fetch repo content", { maxFailures: 1 }),
    })
}

export const useRefetchRepoContent = () => {
    const [repo] = useSelectedRepo()
    const content = useRepoContent(repo, true)
    return content.refetch
}

const pushHabit = async (
    octokit: Octokit,
    habit: Habit,
    owner: string,
    repo: string,
    message: string,
) => {
    const copy = clone(HabitSchema, habit)
    copy.sha = ""

    return octokit.rest.repos.createOrUpdateFileContents({
        path: `habits/${habit.name}.json`,
        owner,
        repo,
        content: btoa(JSON.stringify(toJson(HabitSchema, copy), null, 4)),
        message,
        sha: habit.sha,
        headers: { "If-None-Match": "" },
    })
}

export const useNewHabit = () => {
    const account = useStoredAccountContext()
    const [repo] = useSelectedRepo()
    const octokit = useOctokit()

    return useMutation({
        mutationFn: (habit: Habit) => {
            if (repo === undefined) throw new Error("repo is not selected")
            return pushHabit(
                octokit,
                habit,
                account.login,
                repo.name,
                `start new habit - "${habit.name}"`,
            )
        },
        retry: 0,
    })
}

export const useUpdateHabit = (name: string) => {
    const account = useStoredAccountContext()
    const [repo] = useSelectedRepo()
    const octokit = useOctokit()
    const habit = useHabit(name)

    return useMutation({
        mutationFn: (habit: Habit) => {
            if (repo === undefined) throw new Error("repo is not selected")
            console.info("updateHabit", habit)
            return pushHabit(octokit, habit, account.login, repo.name, `update habit - "${name}"`)
        },
        onSettled: async () => {
            await client.invalidateQueries({ queryKey: ["habits", name] })
            await habit.refetch()
        },
        retry: 0,
    })
}

export const useBreakHabit = () => {
    const account = useStoredAccountContext()
    const [repo] = useSelectedRepo()
    const octokit = useOctokit()

    return useMutation({
        mutationFn: (habit: Habit) => {
            if (repo === undefined) throw new Error("repo is not selected")

            return octokit.rest.repos.deleteFile({
                owner: account.login,
                repo: repo.name,
                path: `habits/${habit.name}.json`,
                message: `breaking a habit - ${habit.name}`,
                sha: habit.sha,
            })
        },
        retry: handleError("Failed to break a habit", { maxFailures: 0 }),
    })
}

export const useHabit = (name: string) => {
    const account = useStoredAccountContext()
    const [repo] = useSelectedRepo()
    const octokit = useOctokit()

    return useQuery({
        queryKey: ["habits", name],
        queryFn: async ({ signal }) => {
            if (repo === undefined) throw new Error("repo is not selected")

            const response = await octokit.rest.repos.getContent({
                owner: account.login,
                repo: repo.name,
                path: `habits/${name}.json`,
                request: { signal },
                headers: { "If-None-Match": "" },
            })

            if (Array.isArray(response.data)) {
                console.error("getContent", { name, response })
                throw new Error("unexpected response type (array)")
            }

            if (response.data.type !== "file") {
                console.error("getContent", { name, response })
                throw new Error(`unexpected response type (${response.data.type})`)
            }

            const habit = fromJsonString(HabitSchema, atob(response.data.content))
            habit.sha = response.data.sha

            return habit
        },
        staleTime: 5 * 60 * 1000, // todo
        retry: handleError(`Failed to fetch habit data: ${name}`),
    })
}
