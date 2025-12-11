import { clientId, useStoredToken, type StoredToken } from "@/lib/auth";
import React from "react";
import { LoginButton } from "./login-button";
import { Loader2 } from "lucide-react";
import { ExchangeClient } from "@/lib/queries";
import { toast } from "sonner";
import type { ExchangeResponse } from "@/proto/github/v1/exchange_pb";
import { OctokitContext } from "./octokit-provider";
import { Octokit } from "octokit";

const extractToken = (response: ExchangeResponse): StoredToken => {
  if (!response.accessToken || !response.accessToken.value)
    throw new Error("access token not provided");

  const expiresInMs = Number(response.accessToken.expiresIn?.seconds) * 1000;
  if (expiresInMs < 10000) throw new Error("access token expired");

  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInMs);

  return {
    value: response.accessToken.value,
    expiresAt,
  };
};

export const AuthWall: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [storedToken, setStoredToken] = useStoredToken();
  const [exchanging, setExchanging] = React.useState(false);

  const url = new URL(location.href);
  const code = url.searchParams.get("code");

  const exchangeCode = React.useCallback(
    (code: string) => {
      setExchanging(true);

      toast.promise(
        ExchangeClient.exchange({ clientId, code })
          .then((response) => {
            setStoredToken(extractToken(response));

            const nextURL = new URL(url);
            nextURL.searchParams.delete("code");
            window.history.pushState({}, document.title, nextURL);

            return response;
          })
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
    [setStoredToken]
  );

  React.useEffect(() => {
    if (code && !exchanging && !storedToken) {
      exchangeCode(code);
    }
  }, [code, exchangeCode, exchanging, storedToken]);

  if (storedToken !== undefined) {
    return (
      <OctokitContext.Provider value={new Octokit({ auth: storedToken.value })}>
        {children}
      </OctokitContext.Provider>
    );
  }

  if (exchanging) {
    // GitHub code is received & sent to exchange service, await response.
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col gap-2">
          <Loader2 className="animate-spin" />
          Exchanging GitHub code...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full w-full">
      <LoginButton />
    </div>
  );
};

export default AuthWall;
