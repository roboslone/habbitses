import React from "react"
import { ErrorBoundary } from "react-error-boundary"

import { ErrorView } from "./error-view"
import { LoadingScreen } from "./loading-screen"

interface P extends React.PropsWithChildren {
    label?: string
}

export const Suspense: React.FC<P> = ({ children, label = "Loading..." }) => {
    return (
        <React.Suspense fallback={<LoadingScreen label={label} />}>
            <ErrorBoundary
                fallbackRender={({ error }) => (
                    <div className="flex items-center justify-center h-full w-full">
                        <ErrorView error={error as unknown as Error} />
                    </div>
                )}
            >
                {children}
            </ErrorBoundary>
        </React.Suspense>
    )
}
