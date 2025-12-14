import { useStoredAccountContext } from "@/components/auth/account-context"
import { useCollectionContext } from "@/components/collection/context"
import { useRepoContentContext } from "@/components/repo/content-context"
import { useRepoContext } from "@/components/repo/context"
import { useOctokit } from "@/components/util/octokit-provider"
import { ExchangeService } from "@/proto/github/v1/exchange_pb"
import {
    CollectionSchema,
    type Habit,
    HabitSchema,
    type Tag,
    TagSchema,
} from "@/proto/models/v1/models_pb"
import { type JsonValue, clone, create, fromJsonString, toJson } from "@bufbuild/protobuf"
import { createClient } from "@connectrpc/connect"
import { createGrpcWebTransport } from "@connectrpc/connect-web"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import type { Octokit, RequestError } from "octokit"
import { toast } from "sonner"
import { decode, encode } from "uint8-to-base64"

import { type StoredAccount, useStoredAccount } from "./auth"
import { type RepoContent, useStoredRepos } from "./git"

export const client = new QueryClient()

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

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
        console.error({ error, message: error.message })
        toast.error(op, { description: error.message })
        if (
            (error as RequestError).status >= 400 ||
            error.message.includes("cannot decode message")
        ) {
            return false
        }
        return failureCount < (options?.maxFailures ?? 3)
    }

const decodeFile = (
    path: string,
    response: Awaited<ReturnType<Octokit["rest"]["repos"]["getContent"]>>,
) => {
    if (Array.isArray(response.data)) {
        console.error("getContent", { path, response })
        throw new Error("unexpected response type (array)")
    }

    if (response.data.type === "file") {
        const content = textDecoder.decode(decode(response.data.content))
        return { content, sha: response.data.sha }
    }

    console.error("getContent", { path, response })
    throw new Error(`unexpected response type (${response.data.type})`)
}

const encodeFile = (json: JsonValue) => encode(textEncoder.encode(JSON.stringify(json, null, 4)))

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

export const useRepoContent = () => {
    const repo = useRepoContext()
    const account = useStoredAccountContext()
    const octokit = useOctokit()

    return useQuery({
        queryKey: ["repo", repo.id, "content"],
        queryFn: async ({ signal }) => {
            try {
                const response = await octokit.rest.git.getTree({
                    owner: account.login,
                    repo: repo.name,
                    tree_sha: "HEAD",
                    recursive: "true",
                    request: { signal },
                    headers: { "If-None-Match": "" },
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

export const useCollection = () => {
    const account = useStoredAccountContext()
    const repo = useRepoContext()
    const content = useRepoContentContext()
    const octokit = useOctokit()

    return useQuery({
        queryKey: ["repo", repo.id, "collection"],
        queryFn: async ({ signal }) => {
            if (content.tree.length === 0) {
                return create(CollectionSchema, {})
            }

            const path = "collection.json"

            try {
                const response = await octokit.rest.repos.getContent({
                    owner: account.login,
                    repo: repo.name,
                    path: "collection.json",
                    request: { signal },
                    headers: { "If-None-Match": "" },
                })
                const file = decodeFile(path, response)
                const collection = fromJsonString(CollectionSchema, file.content)
                collection.sha = file.sha

                return collection
            } catch (e) {
                if ((e as RequestError).status === 404) {
                    return create(CollectionSchema, {})
                }
            }
        },
        retry: handleError("Failed to fetch habit collection"),
    })
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
    copy.name = copy.name.trim()
    copy.description = copy.description.trim()

    return octokit.rest.repos.createOrUpdateFileContents({
        path: `habits/${habit.name}.json`,
        owner,
        repo,
        content: encodeFile(toJson(HabitSchema, copy)),
        message,
        sha: habit.sha,
        headers: { "If-None-Match": "" },
    })
}

export const useNewHabit = () => {
    const account = useStoredAccountContext()
    const repo = useRepoContext()
    const octokit = useOctokit()

    return useMutation({
        mutationFn: (habit: Habit) => {
            return pushHabit(
                octokit,
                habit,
                account.login,
                repo.name,
                `start new habit - "${habit.name}"`,
            )
        },
        onSettled: async () => {
            await client.invalidateQueries({ queryKey: ["repo", repo.id, "content"] })
        },
        retry: handleError("Failed to start a habit", { maxFailures: 0 }),
    })
}

export const useUpdateHabit = (name: string) => {
    const account = useStoredAccountContext()
    const repo = useRepoContext()
    const octokit = useOctokit()

    return useMutation({
        mutationFn: (habit: Habit) => {
            if (repo === undefined) throw new Error("repo is not selected")
            console.info("updateHabit", habit)
            return pushHabit(octokit, habit, account.login, repo.name, `update habit - "${name}"`)
        },
        onSettled: async () => {
            await client.invalidateQueries({ queryKey: ["repo", repo.id, "habit", name] })
        },
        retry: 0,
    })
}

export const useBreakHabit = () => {
    const account = useStoredAccountContext()
    const repo = useRepoContext()
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
        onSettled: async () => {
            await client.invalidateQueries({ queryKey: ["repo", repo.id, "content"] })
        },
        retry: handleError("Failed to break a habit", { maxFailures: 0 }),
    })
}

export const useRefresh = () => {
    const repo = useRepoContext()

    return async () => {
        await client.invalidateQueries({ queryKey: ["repo", repo.id] })
    }
}

export const useHabit = (name: string) => {
    const account = useStoredAccountContext()
    const repo = useRepoContext()
    const octokit = useOctokit()

    return useQuery({
        queryKey: ["repo", repo.id, "habit", name],
        queryFn: async ({ signal }) => {
            const path = `habits/${name}.json`
            const response = await octokit.rest.repos.getContent({
                owner: account.login,
                repo: repo.name,
                path,
                request: { signal },
                headers: { "If-None-Match": "" },
            })

            const file = decodeFile(path, response)
            const habit = fromJsonString(HabitSchema, file.content)
            habit.sha = file.sha

            return habit
        },
        staleTime: 5 * 60 * 1000, // todo
        retry: handleError(`Failed to fetch habit data: ${name}`),
    })
}

export const useNewTag = () => {
    const account = useStoredAccountContext()
    const repo = useRepoContext()
    const octokit = useOctokit()
    const { collection } = useCollectionContext()

    return useMutation({
        mutationFn: (tag: Tag) => {
            const copy = clone(CollectionSchema, collection)
            copy.sha = ""
            copy.tags[tag.name] = tag

            return octokit.rest.repos.createOrUpdateFileContents({
                path: "collection.json",
                owner: account.login,
                repo: repo.name,
                content: encodeFile(toJson(CollectionSchema, copy)),
                message: `created tag - ${tag.name}`,
                sha: collection.sha,
                headers: { "If-None-Match": "" },
            })
        },
        onSettled: async () => {
            await client.invalidateQueries({ queryKey: ["repo", repo.id] })
        },
        retry: handleError("Failed to create tag", { maxFailures: 0 }),
    })
}
