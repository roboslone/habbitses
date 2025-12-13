import { ErrorView } from "@/components/util/error-view"
import { LoadingScreen } from "@/components/util/loading-screen"
import { useCurrentAccount } from "@/lib/queries"
import type React from "react"

import { StoredAccountContext } from "./account-context"

export const AccountWall: React.FC<React.PropsWithChildren> = ({ children }) => {
    const account = useCurrentAccount()

    if (account.isPending) {
        return <LoadingScreen label="Loading GitHub account..." />
    }

    if (account.data) {
        return (
            <StoredAccountContext.Provider value={account.data}>
                {children}
            </StoredAccountContext.Provider>
        )
    }

    return <ErrorView error={account.data} />
}
