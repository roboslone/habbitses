import { useCollectionContext } from "@/components/collection/context"
import { HabitCard } from "@/components/habit/card"
import { HabitFetcher } from "@/components/habit/fetcher"
import { TagContext } from "@/components/tag/context"
import { TagList } from "@/components/tag/list"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { Ellipsis, Plus } from "lucide-react"
import React from "react"

export const HabitList: React.FC = () => {
    const { tags, habits } = useCollectionContext()

    const [activeTags, setActiveTags] = React.useState<Set<string>>(new Set())
    const toggleTag = (name: string) => {
        if (activeTags.has(name)) {
            setActiveTags(new Set())
        } else {
            setActiveTags(new Set([name]))
        }
    }

    return (
        <TagContext.Provider value={{ active: activeTags, onClick: toggleTag }}>
            <div className="flex flex-col gap-2">
                <div className="flex justify-center">
                    <TagList tags={tags}>
                        {tags.length > 0 && (
                            <Link to="/tags">
                                <Button variant="ghost" size="icon-sm">
                                    <Ellipsis />
                                </Button>
                            </Link>
                        )}
                    </TagList>
                </div>

                <div className="flex flex-col items-center gap-2 w-full">
                    {habits.map((name) => (
                        <HabitFetcher key={name} name={name} mode="active">
                            <HabitCard />
                        </HabitFetcher>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-2 w-full">
                    {habits.map((name) => (
                        <HabitFetcher key={name} name={name} mode="completed">
                            <HabitCard />
                        </HabitFetcher>
                    ))}
                </div>

                {habits.length === 0 && (
                    <>
                        <Link to="/habits/new">
                            <Button size="lg">
                                <Plus />
                                Start a new habit!
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </TagContext.Provider>
    )
}
