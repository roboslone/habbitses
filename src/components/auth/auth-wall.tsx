import { LoginButton } from "@/components/auth/login-button"
import { LogoutButton } from "@/components/auth/logout-button"
import { ErrorView } from "@/components/util/error-view"
import { LoadingScreen } from "@/components/util/loading-screen"
import { OctokitContext } from "@/components/util/octokit-provider"
import { type StoredToken, type StoredTokens, clientId, useStoredTokens } from "@/lib/auth"
import { ExchangeClient } from "@/lib/queries"
import type { ExchangeResponse, RefreshResponse, Token } from "@/proto/github/v1/exchange_pb"
import { Octokit } from "octokit"
import React from "react"
import { toast } from "sonner"

const parseToken = (token?: Token): StoredToken => {
    if (!token || !token.value) throw new Error("token value not provided")

    const expiresInMs = Number(token.expiresIn?.seconds) * 1000
    if (expiresInMs < 10000) throw new Error("token expired")

    const now = new Date()
    const expiresAt = new Date(now.getTime() + expiresInMs)

    return {
        value: token.value,
        expiresAt,
    }
}

const extractTokens = (response: ExchangeResponse | RefreshResponse): StoredTokens => {
    return {
        access: parseToken(response.accessToken),
        refresh: parseToken(response.refreshToken),
    }
}

const accessTokenExpired = (tokens: StoredTokens): boolean => {
    return new Date(tokens.access.expiresAt) < new Date()
}

export const AuthWall: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [storedTokens, setStoredTokens] = useStoredTokens()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<Error | undefined>(undefined)

    const url = new URL(location.href)
    const code = url.searchParams.get("code")

    const getTokens = React.useCallback(
        (promise: Promise<StoredTokens>) => {
            setLoading(true)
            return promise
                .then((tokens) => {
                    setError(undefined)
                    setStoredTokens(tokens)

                    const nextURL = new URL(location.href)
                    nextURL.searchParams.delete("code")
                    window.history.pushState({}, document.title, nextURL)

                    return tokens
                })
                .catch((e: Error) => {
                    setError(e)
                    throw e
                })
                .finally(() => setLoading(false))
        },
        [setStoredTokens],
    )

    const exchangeCode = React.useCallback(
        (code: string) =>
            toast.promise(
                getTokens(ExchangeClient.exchange({ clientId, code }).then(extractTokens)),
                {
                    loading: "Exchanging GitHub code...",
                    success: "Signed in",
                    error: (e: Error) => ({
                        message: "Sign in failed",
                        description: e.message,
                    }),
                },
            ),
        [getTokens],
    )

    const refreshToken = React.useCallback(
        (refreshToken: string) =>
            toast.promise(
                getTokens(ExchangeClient.refresh({ clientId, refreshToken }).then(extractTokens)),
                {
                    success: "GitHub token refreshed",
                    error: (e: Error) => ({
                        message: "Token refresh failed",
                        description: e.message,
                    }),
                },
            ),
        [getTokens],
    )

    React.useEffect(() => {
        if (loading || error) return

        if (code && !storedTokens) {
            exchangeCode(code)
        } else if (storedTokens && accessTokenExpired(storedTokens)) {
            refreshToken(storedTokens.refresh.value)
        }
    }, [code, error, exchangeCode, loading, refreshToken, storedTokens])

    if (storedTokens !== undefined && !accessTokenExpired(storedTokens)) {
        return (
            <OctokitContext.Provider value={new Octokit({ auth: storedTokens.access.value })}>
                {children}
            </OctokitContext.Provider>
        )
    }

    if (error !== undefined) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <ErrorView error={error}>
                    <LogoutButton variant="outline" />
                </ErrorView>
            </div>
        )
    }

    if (loading) {
        return <LoadingScreen label="Exchanging GitHub code..." />
    }

    return (
        <div className="flex items-center justify-center h-full w-full">
            <LoginButton />
        </div>
    )
}

export default AuthWall
