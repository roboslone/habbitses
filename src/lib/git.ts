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
