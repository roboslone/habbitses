import useLocalStorage from "use-local-storage";
import type { components } from "@octokit/openapi-types";
import type { Octokit } from "octokit";

export type Repo = components["schemas"]["repository"];
export type RepoContent = Awaited<
  ReturnType<Octokit["rest"]["git"]["getTree"]>
>["data"];

export const useStoredRepos = () => {
  return useLocalStorage<Repo[] | undefined>("habbitses/repos/v1", undefined, {
    syncData: true,
  });
};

export const useSelectedRepo = () => {
  return useLocalStorage<Repo | undefined>("habbitses/repo/v1", undefined, {
    syncData: true,
  });
};

export function* parseRepoContent(content: RepoContent) {
  for (const item of content.tree) {
    if (item.path.startsWith("habits/")) {
      const parts = item.path.split("/");
      if (parts.length === 2 && parts[1].endsWith(".json")) {
        yield parts[1].slice(0, parts[1].length - ".json".length);
      }
    }
  }
}
