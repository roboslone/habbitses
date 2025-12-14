import { useRepoContext } from "@/components/repo/context"
import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"
import type React from "react"

interface P extends React.ComponentProps<typeof Button> {
    name: string
}

export const FileButton: React.FC<P> = ({ name, ...rest }) => {
    const repo = useRepoContext()
    const fileURL = `https://github.com/${repo?.full_name}/blob/main/habits/${name}.json`
    return (
        <a href={fileURL} target="_blank">
            <Button variant="ghost" {...rest}>
                <Code />
                File
            </Button>
        </a>
    )
}
