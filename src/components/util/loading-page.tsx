import { PageHeader } from "@/components/page-header"
import { LoadingScreen } from "@/components/util/loading-screen"
import type React from "react"

export const LoadingPage: React.FC<React.ComponentProps<typeof LoadingScreen>> = (props) => (
    <div data-testid="loading-page" className="w-full h-full flex flex-col">
        <PageHeader />
        <LoadingScreen {...props} className="p-0 grow h-auto" />
    </div>
)
