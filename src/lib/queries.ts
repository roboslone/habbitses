import { QueryClient, useQuery } from "@tanstack/react-query";
import { ExchangeService } from "@/proto/github/v1/exchange_pb";
import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { useOctokit } from "@/components/util/octokit-provider";
import { useStoredAccount, type StoredAccount } from "./auth";
import { useStoredAccountContext } from "@/components/auth/account-context";
import { toast } from "sonner";
import { useStoredRepos, type Repo, type RepoContent } from "./git";
import type { RequestError } from "octokit";

export const client = new QueryClient();

export const ExchangeClient = createClient(
  ExchangeService,
  createGrpcWebTransport({
    baseUrl: "https://robosl.one",
    useBinaryFormat: true,
    defaultTimeoutMs: 30 * 1000,
    fetch: (input, init) => fetch(input, { ...init, credentials: "include" }),
  })
);

interface RetryOptions {
  maxAttempts?: number;
}

const handleError =
  (op: string, options?: RetryOptions) =>
  (failureCount: number, error: Error): boolean => {
    toast.error(op, { description: error.message, closeButton: true });
    return failureCount < (options?.maxAttempts ?? 3);
  };

export const useCurrentAccount = () => {
  const octokit = useOctokit();
  const [account, setAccount] = useStoredAccount();

  return useQuery({
    queryKey: ["accounts", "current"],
    queryFn: async ({ signal }) => {
      const response = await octokit.rest.users.getAuthenticated({
        request: { signal },
      });

      const account: StoredAccount = {
        id: response.data.id,
        login: response.data.login,
        avatarURL: response.data.avatar_url,
      };
      setAccount(account);
      return account;
    },
    staleTime: Infinity,
    initialData: account,
    retry: handleError("GitHub authentication failed", { maxAttempts: 1 }),
  });
};

export const useRefreshRepos = () => {
  const repos = useRepos();

  return async () => {
    await client.invalidateQueries({ queryKey: ["repos"] });
    await repos.refetch();
  };
};

export const useRepos = () => {
  const octokit = useOctokit();
  const [repos, setRepos] = useStoredRepos();

  return useQuery({
    queryKey: ["repos"],
    queryFn: async ({ signal }) => {
      const response = await octokit.rest.repos.listForAuthenticatedUser({
        affiliation: "owner",
        visibility: "private",
        request: { signal },
      });
      setRepos(response.data as Repo[]);
      return response.data as Repo[];
    },
    staleTime: 60 * 1000,
    initialData: repos,
    retry: handleError("Failed to fetch repos"),
  });
};

export const useRepoContent = (repo: Repo) => {
  const account = useStoredAccountContext();
  const octokit = useOctokit();

  return useQuery({
    queryKey: ["repo", repo.id, "content"],
    queryFn: async ({ signal }) => {
      const response = await octokit.rest.git
        .getTree({
          owner: account.login,
          repo: repo.name,
          tree_sha: "HEAD",
          request: { signal },
        })
        .catch((e: RequestError) => {
          if (e.status === 409 && e.message.includes("is empty")) {
            return {
              data: { sha: "", truncated: false, tree: [] } as RepoContent,
            };
          }
          throw e;
        });

      return response.data as RepoContent;
    },
    retry: handleError("Failed to fetch repo content", { maxAttempts: 1 }),
  });
};
