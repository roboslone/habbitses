import {
    type Collection,
    CollectionSchema,
    type Habit,
    HabitSchema,
} from "@/proto/models/v1/models_pb"
import { fromJsonString, toJsonString } from "@bufbuild/protobuf"
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

type StoredJSON = {
    updatedAt: Date
    data: string
}

const useStoredProto = <T>(toJSON: (data: T) => string, fromJSON: (data: string) => T) => {
    const serializer = (data: Stored<T> | undefined): string => {
        if (data === undefined) return ""
        return JSON.stringify({
            updatedAt: data.updatedAt,
            data: toJSON(data.data),
        } as StoredJSON)
    }
    const parser = (raw: string): Stored<T> | undefined => {
        if (raw === "") return undefined
        const parsed = JSON.parse(raw) as StoredJSON
        return {
            updatedAt: new Date(parsed.updatedAt),
            data: fromJSON(parsed.data),
        }
    }
    return { serializer, parser }
}

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
    useLocalStorage<Stored<Collection>>("habbitses/collection/v2", undefined, {
        syncData: true,
        ...useStoredProto<Collection>(
            (d) => toJsonString(CollectionSchema, d),
            (s) => fromJsonString(CollectionSchema, s),
        ),
    })

export const useStoredHabit = (name: string) =>
    useLocalStorage<Stored<Habit>>(`habbitses/habits/v1/${name}`, undefined, {
        syncData: true,
        ...useStoredProto<Habit>(
            (d) => toJsonString(HabitSchema, d),
            (s) => fromJsonString(HabitSchema, s),
        ),
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
