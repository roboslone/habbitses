import { Button } from "@/components/ui/button"
import type React from "react"

import { useStoredAccountContext } from "./account-context"

export const AccountBadge: React.FC = () => {
    const account = useStoredAccountContext()

    return (
        <Button variant="outline" className="px-0 py-0 truncate pr-2">
            <img src={account.avatarURL} className="h-full aspect-square" />
            {account.login}
        </Button>
    )
}
