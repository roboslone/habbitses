import { AccountBadge } from "@/components/auth/account-chip"
import { LogoutButton } from "@/components/auth/logout-button"
import { useStoredDisplayOptions } from "@/lib/displayOptions"
import { Link } from "@tanstack/react-router"
import { ExternalLink } from "lucide-react"
import React from "react"

import { DisplayOptionsForm } from "./display-options-form"
import { PageHeader } from "./page-header"
import { RepoSelector } from "./repo/selector"
import { Button } from "./ui/button"
import { Label } from "./ui/label"

export const SettingsPage: React.FC = () => {
    const [displayOptions, setDisplayOptions] = useStoredDisplayOptions()

    return (
        <>
            <PageHeader title="Settings" />

            <div className="flex flex-col gap-5 p-5 pt-0 w-full">
                <div className="flex flex-col gap-3">
                    <Label>Account</Label>
                    <div className="flex items-center gap-2">
                        <AccountBadge />
                        <LogoutButton variant="destructive" className="w-fit" />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Label>Repository</Label>
                    <RepoSelector />
                </div>

                <Link to="/tags">
                    <Button variant="outline" className="w-fit">
                        <ExternalLink />
                        Tags
                    </Button>
                </Link>

                <DisplayOptionsForm options={displayOptions} onChange={setDisplayOptions} />
            </div>
        </>
    )
}

export default SettingsPage
