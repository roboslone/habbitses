import { useCollectionContext } from "@/components/collection/context"
import { getProgress } from "@/lib/progress"
import { useUpdateOrder } from "@/lib/queries"
import type { Habit } from "@/proto/models/v1/models_pb"
import {
    DndContext,
    type DragEndEvent,
    PointerSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import React from "react"

import { OrderingContext } from "./context"

const reorder = (
    existing: Set<string>,
    completed: Set<string>,
    order: string[],
    isReordering: boolean,
): string[] => {
    const ordered: string[] = []
    const missed = new Set(existing)

    for (const name of order) {
        if (missed.has(name)) {
            ordered.push(name)
            missed.delete(name)
        }
    }
    ordered.push(...[...missed].sort())

    if (isReordering) return ordered

    ordered.sort((a, b) => {
        const aCompleted = completed.has(a)
        const bCompleted = completed.has(b)
        if (aCompleted && bCompleted) return 0
        if (aCompleted) return 1
        return -1
    })
    return ordered
}

const orderChanged = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return true
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return true
    }
    return false
}

export const OrderingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { habits, collection } = useCollectionContext()

    const [completed, setCompleted] = React.useState<Set<string>>(new Set())
    const recordCompletion = (h: Habit) => {
        const { completion } = getProgress(h, new Date())
        const isCompleted = completion.count >= completion.target

        setCompleted((prev) => {
            const next = new Set(prev)
            if (isCompleted) {
                next.add(h.name)
            } else {
                next.delete(h.name)
            }
            return next
        })
    }

    const [isReordering, _setReordering] = React.useState(false)
    const [orderedNames, setOrderedNames] = React.useState<string[]>(
        reorder(habits, completed, collection.order, isReordering),
    )

    React.useEffect(() => {
        setOrderedNames(reorder(habits, completed, collection.order, isReordering))
    }, [completed])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!!over && active.id !== over.id) {
            const aID = active.id as unknown as string
            const oID = over.id as unknown as string

            setOrderedNames((items) => {
                const curr = items.indexOf(aID)
                const next = items.indexOf(oID)
                return arrayMove(items, curr, next)
            })
        }
    }

    const updateOrder = useUpdateOrder()
    const setReordering = (v: boolean) => {
        _setReordering(v)
        setOrderedNames(reorder(habits, completed, collection.order, v))

        if (!v && orderChanged(collection.order, orderedNames)) {
            updateOrder.mutate(orderedNames)
        }
    }

    const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor))
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <OrderingContext.Provider
                value={{
                    completed,
                    recordCompletion,
                    isReordering,
                    setReordering,
                    orderedNames,
                    update: updateOrder,
                }}
            >
                <SortableContext items={orderedNames} strategy={verticalListSortingStrategy}>
                    {children}
                </SortableContext>
            </OrderingContext.Provider>
        </DndContext>
    )
}
