import { QueryClient, useQuery } from "@tanstack/react-query";
import { ExchangeService } from "@/proto/github/v1/exchange_pb";
import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { useOctokit } from "@/components/octokit-provider";
import { useStoredAccount, type StoredAccount } from "./auth";

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
    retry: 1,
  });
};

// export const useRepos = () => {
//   const octokit = useOctokit()

//   return useQuery({
//     queryKey: ["repos"],
//     queryFn: ({signal}) => {
//       octokit.rest.repos.listForUser({
//         username
//       })
//     }
//   })
// }
