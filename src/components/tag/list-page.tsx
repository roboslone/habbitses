import { useCollectionContext } from "@/components/collection/context"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import type React from "react"

import { TagList } from "./list"

export const TagListPage: React.FC = () => {
    const { tags } = useCollectionContext()

    return (
        <>
            <PageHeader
                title="Tags"
                buttonRight={
                    <Link to="/tags/new">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon-lg">
                                    <Plus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Create new tag</TooltipContent>
                        </Tooltip>
                    </Link>
                }
            />

            <div className="p-2 pt-0">
                <TagList tags={tags} />
            </div>
        </>
    )
}

export default TagListPage
