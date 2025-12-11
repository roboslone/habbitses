import {
  clientId,
  useStoredTokens,
  type StoredToken,
  type StoredTokens,
} from "@/lib/auth";
import React from "react";
import { ErrorView } from "@/components/util/error-view";
import { ExchangeClient } from "@/lib/queries";
import { LoadingScreen } from "@/components/util/loading-screen";
import { LoginButton } from "@/components/auth/login-button";
import { LogoutButton } from "@/components/auth/logout-button";
import { Octokit } from "octokit";
import { OctokitContext } from "@/components/util/octokit-provider";
import { toast } from "sonner";
import type { ExchangeResponse, Token } from "@/proto/github/v1/exchange_pb";

const parseToken = (token?: Token): StoredToken => {
  if (!token || !token.value) throw new Error("token value not provided");

  const expiresInMs = Number(token.expiresIn?.seconds) * 1000;
  if (expiresInMs < 10000) throw new Error("token expired");

  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInMs);

  return {
    value: token.value,
    expiresAt,
  };
};

const extractTokens = (response: ExchangeResponse): StoredTokens => {
  return {
    access: parseToken(response.accessToken),
    refresh: parseToken(response.refreshToken),
  };
};

export const AuthWall: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [storedTokens, setStoredTokens] = useStoredTokens();
  const [exchanging, setExchanging] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  const url = new URL(location.href);
  const code = url.searchParams.get("code");

  const exchangeCode = React.useCallback(
    (code: string) => {
      setExchanging(true);

      toast.promise(
        ExchangeClient.exchange({ clientId, code })
          .then((response) => {
            setError(undefined);
            setStoredTokens(extractTokens(response));

            const nextURL = new URL(location.href);
            nextURL.searchParams.delete("code");
            window.history.pushState({}, document.title, nextURL);

            return response;
          })
          .catch(setError)
          .finally(() => setExchanging(false)),
        {
          loading: "Exchanging GitHub code...",
          success: "Signed in",
          error: (e: Error) => ({
            message: "Sign in failed",
            description: e.message,
          }),
        }
      );
    },
    [setStoredTokens]
  );

  React.useEffect(() => {
    if (code && !exchanging && !error && !storedTokens) {
      exchangeCode(code);
    }
  }, [code, error, exchangeCode, exchanging, storedTokens]);

  if (storedTokens !== undefined) {
    // todo: check expiration, refresh in background if refresh token is available
    return (
      <OctokitContext.Provider
        value={new Octokit({ auth: storedTokens.access.value })}
      >
        {children}
      </OctokitContext.Provider>
    );
  }

  if (error !== undefined) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <ErrorView error={error} />
        <LogoutButton />
      </div>
    );
  }

  if (exchanging) {
    return <LoadingScreen label="Exchanging GitHub code..." />;
  }

  return (
    <div className="flex items-center justify-center h-full w-full">
      <LoginButton />
    </div>
  );
};

export default AuthWall;
