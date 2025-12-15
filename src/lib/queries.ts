import { useStoredAccountContext } from "@/components/auth/account-context"
import { useCollectionContext } from "@/components/collection/context"
import { useOrderingContext } from "@/components/ordering/context"
import { useRepoContentContext } from "@/components/repo/content-context"
import { useRepoContext } from "@/components/repo/context"
import { useOctokit } from "@/components/util/octokit-provider"
import { ExchangeService } from "@/proto/github/v1/exchange_pb"
import {
    type Collection,
    CollectionSchema,
    type Habit,
    HabitSchema,
    type Tag,
} from "@/proto/models/v1/models_pb"
import { type JsonValue, clone, create, fromJsonString, toJson } from "@bufbuild/protobuf"
import { createClient } from "@connectrpc/connect"
import { createGrpcWebTransport } from "@connectrpc/connect-web"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import type { Octokit, RequestError } from "octokit"
import { toast } from "sonner"
import { decode, encode } from "uint8-to-base64"

import { type StoredAccount, useStoredAccount } from "./auth"
import { type RepoContent, useStoredCollection, useStoredRepoContent, useStoredRepos } from "./git"

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

    const [stored, setStored] = useStoredRepoContent()

    return useQuery({
        queryKey: ["repo", repo.id, "content"],
        queryFn: async ({ signal }) => {
            let data: RepoContent
            try {
                const response = await octokit.rest.git.getTree({
                    owner: account.login,
                    repo: repo.name,
                    tree_sha: "HEAD",
                    recursive: "true",
                    request: { signal },
                    headers: { "If-None-Match": "" },
                })
                data = response.data
            } catch (e: unknown) {
                if ((e as RequestError).status === 404 || (e as RequestError).status === 409) {
                    // empty repo
                    data = {
                        sha: "",
                        truncated: false,
                        tree: [],
                    } as RepoContent
                }
                throw e
            }

            setStored({ data, updatedAt: new Date() })
            return data
        },
        initialData: stored?.data,
        initialDataUpdatedAt: stored?.updatedAt?.getTime?.(),
        staleTime: 5 * 60 * 1000, // todo
        retry: handleError("Failed to fetch repo content", { maxFailures: 1 }),
    })
}

export const useCollection = () => {
    const account = useStoredAccountContext()
    const repo = useRepoContext()
    const { repoContent } = useRepoContentContext()
    const octokit = useOctokit()

    const [stored, setStored] = useStoredCollection()

    return useQuery({
        queryKey: ["repo", repo.id, "collection"],
        queryFn: async ({ signal }) => {
            if (repoContent.tree.length === 0) {
                return create(CollectionSchema, {})
            }

            const path = "collection.json"
            let collection: Collection
            try {
                const response = await octokit.rest.repos.getContent({
                    owner: account.login,
                    repo: repo.name,
                    path: "collection.json",
                    request: { signal },
                    headers: { "If-None-Match": "" },
                })
                const file = decodeFile(path, response)
                collection = fromJsonString(CollectionSchema, file.content)
                collection.sha = file.sha
            } catch (e) {
                if ((e as RequestError).status === 404) {
                    collection = create(CollectionSchema, {})
                }
                throw e
            }

            setStored({ data: collection, updatedAt: new Date() })
            return collection
        },
        initialData: stored?.data,
        initialDataUpdatedAt: stored?.updatedAt?.getTime?.(),
        staleTime: 5 * 60 * 1000, // todo
        retry: handleError("Failed to fetch habit collection"),
    })
}

const usePushHabit = () => {
    const account = useStoredAccountContext()
    const repo = useRepoContext()
    const octokit = useOctokit()

    return (message: string, habit: Habit) => {
        const copy = clone(HabitSchema, habit)
        copy.sha = ""
        copy.name = copy.name.trim()
        copy.description = copy.description.trim()

        console.info("push habit", copy)

        return octokit.rest.repos.createOrUpdateFileContents({
            path: `habits/${habit.name}.json`,
            owner: account.login,
            repo: repo.name,
            content: encodeFile(toJson(HabitSchema, copy)),
            message,
            sha: habit.sha,
            headers: { "If-None-Match": "" },
        })
    }
}

export const useNewHabit = () => {
    const repo = useRepoContext()
    const pushHabit = usePushHabit()

    return useMutation({
        mutationFn: (habit: Habit) => pushHabit(`start new habit - "${habit.name}"`, habit),

        onSettled: async () => {
            await client.invalidateQueries({ queryKey: ["repo", repo.id, "content"] })
        },
        retry: handleError("Failed to start a habit", { maxFailures: 0 }),
    })
}

export const useUpdateHabit = (name: string) => {
    const repo = useRepoContext()
    const pushHabit = usePushHabit()
    const { recordCompletion } = useOrderingContext()

    const queryKey = ["repo", repo.id, "habit", name]

    return useMutation({
        mutationFn: async (habit: Habit) => pushHabit(`update habit - "${name}"`, habit),
        onMutate: async (next: Habit) => {
            const prev: Habit | undefined = client.getQueryData(queryKey)
            await client.setQueryData(queryKey, next)
            recordCompletion(next)
            return { prev }
        },
        onError: (_, __, context) => {
            if (context?.prev) {
                client.setQueryData(queryKey, context.prev)
                recordCompletion(context.prev)
            }
        },
        onSettled: async () => {
            await client.invalidateQueries({ queryKey })
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
    const { recordCompletion } = useOrderingContext()

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

            recordCompletion(habit)

            return habit
        },
        staleTime: 5 * 60 * 1000, // todo
        retry: handleError(`Failed to fetch habit data: ${name}`),
    })
}

const usePushCollection = () => {
    const account = useStoredAccountContext()
    const repo = useRepoContext()
    const { collection } = useCollectionContext()
    const octokit = useOctokit()

    return (update: (c: Collection) => void, message: string) => {
        const copy = clone(CollectionSchema, collection)

        update(copy)
        copy.sha = ""

        return octokit.rest.repos.createOrUpdateFileContents({
            path: "collection.json",
            owner: account.login,
            repo: repo.name,
            content: encodeFile(toJson(CollectionSchema, copy)),
            message,
            sha: collection.sha,
            headers: { "If-None-Match": "" },
        })
    }
}

const useInvalidateCollection = () => {
    const repo = useRepoContext()
    return async () => {
        await client.invalidateQueries({ queryKey: ["repo", repo.id, "collection"] })
    }
}

export const useDeleteTags = () => {
    const pushCollection = usePushCollection()
    const invalidateCollection = useInvalidateCollection()

    return useMutation({
        mutationFn: (tags: string[]) =>
            pushCollection((c) => {
                for (const name of tags) {
                    delete c.tags[name]
                }
            }, `deleted ${tags.length} tag(s)`),
        onSettled: invalidateCollection,
        retry: handleError("Failed to delete tags", { maxFailures: 0 }),
    })
}

export const useNewTag = () => {
    const pushCollection = usePushCollection()
    const invalidateCollection = useInvalidateCollection()

    return useMutation({
        mutationFn: (tag: Tag) =>
            pushCollection((c) => (c.tags[tag.name] = tag), `created tag - ${tag.name}`),
        onSettled: invalidateCollection,
        retry: handleError("Failed to create tag", { maxFailures: 0 }),
    })
}

export const useUpdateOrder = () => {
    const pushCollection = usePushCollection()
    const invalidateCollection = useInvalidateCollection()

    return useMutation({
        mutationFn: (order: string[]) =>
            pushCollection((c) => (c.order = order), `reordered habits`),
        onSettled: invalidateCollection,
        retry: handleError("Failed to update order", { maxFailures: 0 }),
    })
}
