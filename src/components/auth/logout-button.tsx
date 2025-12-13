import { Button } from "@/components/ui/button"
import { useStoredAccount, useStoredTokens } from "@/lib/auth"
import { LogOut } from "lucide-react"
import type React from "react"

export const LogoutButton: React.FC<React.ComponentProps<typeof Button>> = (props) => {
    const [, setUsername] = useStoredAccount()
    const [, setTokens] = useStoredTokens()

    const handleClick = () => {
        setTokens(undefined)
        setUsername(undefined)
        document.location.reload()
    }

    return (
        <Button className="cursor-pointer" onClick={handleClick} {...props}>
            <LogOut />
            Sign out
        </Button>
    )
}
