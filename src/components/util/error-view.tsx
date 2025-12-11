import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon, RefreshCcw } from "lucide-react"
import type React from "react"

type P = React.PropsWithChildren & {
    title?: string
    error: Error | null | undefined
    retry?: () => Promise<unknown>
}

export const ErrorView: React.FC<P> = ({ title, error, retry, children }) => {
    error ??= new Error("Unknown error")

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="grid gap-6 min-w-lg">
                <div className="flex flex-col gap-4">
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>{title ?? error.name}</AlertTitle>
                        <AlertDescription>
                            <p>Please try again later.</p>
                            <code className="bg-muted relative rounded-sm px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold w-full">
                                {error.message}
                            </code>
                        </AlertDescription>
                    </Alert>

                    {children}

                    {retry !== undefined && (
                        <Button variant="outline" onClick={() => void retry()}>
                            <RefreshCcw />
                            Retry
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
