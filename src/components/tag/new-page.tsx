import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { useNewTag } from "@/lib/queries"
import { Link } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import type React from "react"

import { TagForm } from "./form"

const NewTagPage: React.FC = () => {
    const newTag = useNewTag()

    return (
        <>
            <PageHeader
                title="Create new tag"
                buttonLeft={
                    <Link to="/tags">
                        <Button variant="ghost" size="icon-lg">
                            <ChevronLeft />
                        </Button>
                    </Link>
                }
            />
            <TagForm onChange={newTag.mutateAsync} />
        </>
    )
}

export default NewTagPage
