import { useRefresh } from "@/lib/queries"
import { cn } from "@/lib/utils"
import { RefreshCw } from "lucide-react"
import type React from "react"

import { useCollectionContext } from "./collection/context"
import { useRepoContentContext } from "./repo/content-context"
import { Button } from "./ui/button"

export const RefreshButton: React.FC<React.ComponentProps<typeof Button>> = (props) => {
    const { isFetching: repoIsFetching } = useRepoContentContext()
    const { isFetching: collectionIsFetching } = useCollectionContext()
    const refresh = useRefresh()
    const loading = repoIsFetching || collectionIsFetching

    return (
        <Button variant="ghost" disabled={loading} onClick={() => void refresh()} {...props}>
            <RefreshCw className={cn({ "animate-spin": loading })} />
            Refresh
        </Button>
    )
}
