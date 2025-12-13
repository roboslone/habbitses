import type { StoredAccount } from "@/lib/auth"
import React from "react"

export const StoredAccountContext = React.createContext<StoredAccount>({
    id: -1,
    avatarURL: "",
    login: "",
})

export const useStoredAccountContext = () => {
    const context = React.useContext(StoredAccountContext)
    if (!context) {
        throw new Error("stored account context not available")
    }
    return context
}
