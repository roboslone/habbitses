import GitHubLogo from "@/assets/github.svg?url"
import { Button } from "@/components/ui/button"
import { clientId } from "@/lib/const"
import type React from "react"

export const LoginButton: React.FC<React.ComponentProps<typeof Button>> = (props) => {
    const pathParts = document.location.pathname.split("/")
    let path = "/"
    if (pathParts.length > 1) {
        path = pathParts.slice(0, 2).join("/") + "/"
    }

    const redirectURI = `${document.location.origin}${path}`

    const handleClick = () => {
        window.open(
            `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}`,
            "_self",
        )
    }

    return (
        <Button className="cursor-pointer" onClick={handleClick} {...props}>
            <img src={GitHubLogo} className="h-6 w-6" />
            Log in with GitHub
        </Button>
    )
}
