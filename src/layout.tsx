import { AccountWall } from "@/components/auth/account-wall"
import AuthWall from "@/components/auth/auth-wall"
import { RepoWall } from "@/components/auth/repo-wall"
import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "@/components/util/suspense"
import { ThemeProvider } from "@/components/util/theme-provider"
import { client } from "@/lib/queries"
import { QueryClientProvider } from "@tanstack/react-query"
import { Outlet } from "@tanstack/react-router"
import React from "react"

export const Layout: React.FC = () => {
    return (
        <ThemeProvider>
            <Suspense>
                <QueryClientProvider client={client}>
                    <AuthWall>
                        <AccountWall>
                            <RepoWall>
                                <Outlet />
                            </RepoWall>
                        </AccountWall>
                    </AuthWall>
                </QueryClientProvider>
                <Toaster />
            </Suspense>
        </ThemeProvider>
    )
}

export default Layout
