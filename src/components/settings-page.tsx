import { AccountBadge } from "@/components/auth/account-chip"
import { LogoutButton } from "@/components/auth/logout-button"
import { useStoredDisplayOptions } from "@/lib/displayOptions"
import { Link } from "@tanstack/react-router"
import { ExternalLink, Monitor, Moon, Sun } from "lucide-react"
import React from "react"

import { DisplayOptionsForm } from "./display-options-form"
import { PageHeader } from "./page-header"
import { RepoSelector } from "./repo/selector"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { ThemeContext } from "./util/theme-context"

export const SettingsPage: React.FC = () => {
    const { theme, setTheme } = React.useContext(ThemeContext)
    const [displayOptions, setDisplayOptions] = useStoredDisplayOptions()

    return (
        <>
            <PageHeader title="Settings" />

            <div className="flex flex-col gap-5 p-5 pt-0 w-full max-w-216">
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

                <div className="flex flex-col gap-3">
                    <Label>Theme</Label>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={theme === "light"}
                            onClick={() => setTheme("light")}
                        >
                            <Sun />
                            Light
                        </Button>

                        <Button
                            variant="outline"
                            disabled={theme === "dark"}
                            onClick={() => setTheme("dark")}
                        >
                            <Moon />
                            Dark
                        </Button>

                        <Button
                            variant="outline"
                            disabled={theme === "system"}
                            onClick={() => setTheme("system")}
                        >
                            <Monitor />
                            System
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Label>Tags</Label>
                    <Link to="/tags">
                        <Button variant="outline" className="w-fit">
                            <ExternalLink />
                            Manage
                        </Button>
                    </Link>
                </div>

                <DisplayOptionsForm options={displayOptions} onChange={setDisplayOptions} />
            </div>
        </>
    )
}

export default SettingsPage
