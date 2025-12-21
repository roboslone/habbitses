import { useCollectionContext } from "@/components/collection/context"
import { HabitCard } from "@/components/habit/card"
import { HabitProvider } from "@/components/habit/provider"
import { useOrderingContext } from "@/components/ordering/context"
import { RefreshButton } from "@/components/refresh-button"
import { TagContext } from "@/components/tag/context"
import { TagList } from "@/components/tag/list"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { Check, ChevronsUpDown, Ellipsis, Loader2, Plus } from "lucide-react"
import React from "react"

export const HabitList: React.FC = () => {
    const { tags } = useCollectionContext()
    const { orderedNames, isReordering, setReordering, update } = useOrderingContext()

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
            <div className="flex flex-col gap-2" data-testid="habit-list">
                {tags.length > 0 && (
                    <TagList tags={tags}>
                        <Link to="/tags">
                            <Button variant="ghost" size="icon-sm">
                                <Ellipsis />
                            </Button>
                        </Link>
                    </TagList>
                )}

                <div className="flex flex-col items-center gap-2 w-full">
                    {orderedNames.map((name) => (
                        <HabitProvider key={name} name={name}>
                            <HabitCard />
                        </HabitProvider>
                    ))}
                </div>

                {orderedNames.length === 0 ? (
                    <>
                        <Link to="/habits/new">
                            <Button size="lg">
                                <Plus />
                                Start a new habit!
                            </Button>
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center justify-center gap-2 p-2 pb-4">
                        <RefreshButton disabled={isReordering} />
                        <Button
                            variant="ghost"
                            className="w-fit"
                            onClick={() => setReordering(!isReordering)}
                            disabled={update.isPending}
                        >
                            {isReordering ? (
                                <>
                                    <Check />
                                    Done
                                </>
                            ) : (
                                <>
                                    {update.isPending ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <ChevronsUpDown />
                                    )}
                                    Reorder
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </TagContext.Provider>
    )
}
