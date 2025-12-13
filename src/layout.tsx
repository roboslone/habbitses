import { AccountWall } from "@/components/auth/account-wall"
import AuthWall from "@/components/auth/auth-wall"
import { Toaster } from "@/components/ui/sonner"
import { client } from "@/lib/queries"
import { QueryClientProvider } from "@tanstack/react-query"
import { Outlet } from "@tanstack/react-router"
import React from "react"

import { LoadingScreen } from "./components/util/loading-screen"

export const Layout: React.FC = () => (
    <>
        <React.Suspense fallback={<LoadingScreen />}>
            <QueryClientProvider client={client}>
                <AuthWall>
                    <AccountWall>
                        <Outlet />
                    </AccountWall>
                </AuthWall>
            </QueryClientProvider>
            <Toaster />
        </React.Suspense>
    </>
)

export default Layout
