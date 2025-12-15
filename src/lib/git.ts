import { type Collection } from "@/proto/models/v1/models_pb"
import type { components } from "@octokit/openapi-types"
import type { Octokit } from "octokit"
import useLocalStorage from "use-local-storage"

export type Repo = components["schemas"]["repository"]
export type RepoContent = Awaited<ReturnType<Octokit["rest"]["git"]["getTree"]>>["data"]

type Stored<T> =
    | {
          data: T
          updatedAt: Date
      }
    | undefined

export const useStoredRepos = () =>
    useLocalStorage<Repo[] | undefined>("habbitses/repos/v1", undefined, {
        syncData: true,
    })

export const useSelectedRepo = () =>
    useLocalStorage<Repo | undefined>("habbitses/repo/v1", undefined, {
        syncData: true,
    })

export const useStoredRepoContent = () =>
    useLocalStorage<Stored<RepoContent>>("habbitses/repo-content/v1", undefined, {
        syncData: true,
    })

export const useStoredCollection = () =>
    useLocalStorage<Stored<Collection>>("habbitses/collection/v1", undefined, {
        syncData: true,
    })

export function* iterHabitNames(content: RepoContent) {
    for (const item of content.tree) {
        if (item.path.startsWith("habits/")) {
            const parts = item.path.split("/")
            if (parts.length === 2 && parts[1].endsWith(".json")) {
                yield parts[1].slice(0, parts[1].length - ".json".length)
            }
        }
    }
}
