import { useCollectionContext } from "@/components/collection/context"
import type React from "react"

import { TagView } from "./view"

interface P extends React.PropsWithChildren {
    tags: string[]
}

export const TagList: React.FC<P> = ({ tags, children }) => {
    const { collection } = useCollectionContext()

    return (
        <div data-testid="tag-list" className="flex items-center justify-center flex-wrap gap-1">
            {tags.sort().map((name) => {
                const tag = collection.tags[name]
                if (!tag) return null
                return <TagView key={name} name={name} tag={tag} />
            })}
            {children}
        </div>
    )
}
