import { AccountBadge } from "@/components/auth/account-chip"
import { LogoutButton } from "@/components/auth/logout-button"
import { useStoredDisplayOptions } from "@/lib/displayOptions"
import { useQueryClient } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Monitor, Moon, Sun, Tags, Trash2 } from "lucide-react"
import React from "react"
import { toast } from "sonner"

import { DisplayOptionsForm } from "./display-options-form"
import { GitHubIcon } from "./github-icon"
import { PageHeader } from "./page/header"
import { Page } from "./page/page"
import { RefreshButton } from "./refresh-button"
import { useRepoContext } from "./repo/context"
import { RepoSelector } from "./repo/selector"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { ColorPreview } from "./util/color-preview"
import { ThemeContext } from "./util/theme-context"

export const SettingsPage: React.FC = () => {
    const { theme, setTheme, saturation, setSaturation } = React.useContext(ThemeContext)
    const [displayOptions, setDisplayOptions] = useStoredDisplayOptions()
    const queryClient = useQueryClient()
    const repo = useRepoContext()

    const repoURL = `https://github.com/${repo?.full_name}`

    const clearCache = () => {
        queryClient.removeQueries()
        toast.success("Cache cleared")
    }

    return (
        <>
            <PageHeader title="Settings" />

            <Page className="gap-6">
                <div className="flex flex-col gap-3">
                    <Label className="text-muted-foreground">Account</Label>
                    <div className="flex items-center gap-2">
                        <AccountBadge />
                        <LogoutButton variant="destructive" className="w-fit" />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Label className="text-muted-foreground">Repository</Label>
                    <RepoSelector />
                </div>

                <div className="flex flex-col gap-3">
                    <Label className="text-muted-foreground">Theme</Label>
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
                    <Label className="text-muted-foreground">Color saturation</Label>
                    <Slider
                        value={[saturation]}
                        onValueChange={(v) => setSaturation(v[0])}
                        step={10}
                        min={0}
                        max={100}
                    />
                    <ColorPreview />
                </div>

                <div className="flex flex-col gap-3">
                    <Label className="text-muted-foreground">Data</Label>
                    <div className="flex items-center gap-2">
                        <a href={repoURL} target="_blank">
                            <Button variant="outline">
                                <GitHubIcon inverted className="w-4 h-4" />
                                Root
                            </Button>
                        </a>

                        <Link to="/tags">
                            <Button variant="outline" className="w-fit">
                                <Tags />
                                Tags
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Label className="text-muted-foreground">Display options</Label>
                    <DisplayOptionsForm options={displayOptions} onChange={setDisplayOptions} />
                </div>

                <div className="flex flex-col gap-3">
                    <Label className="text-muted-foreground">Cache</Label>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="w-fit" onClick={clearCache}>
                            <Trash2 />
                            Clear cache
                        </Button>
                        <RefreshButton variant="outline" />
                    </div>
                </div>
            </Page>
        </>
    )
}

export default SettingsPage
