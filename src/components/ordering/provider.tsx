import { useCollectionContext } from "@/components/collection/context"
import { DateContext } from "@/components/date/context"
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
import { orderChanged, orderHabits } from "./ordering"

export const OrderingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const date = React.useContext(DateContext)

    const { habits, collection } = useCollectionContext()

    const [completed, setCompleted] = React.useState<Set<string>>(new Set())
    const recordCompletion = (h: Habit) => {
        const { completion } = getProgress(h, date)
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

    const reorder = (isReordering: boolean) =>
        orderHabits(habits, completed, collection.order, isReordering)

    const [isReordering, _setReordering] = React.useState(false)
    const [orderedNames, setOrderedNames] = React.useState<string[]>(reorder(isReordering))

    React.useEffect(() => {
        setCompleted(new Set())
    }, [date])

    React.useEffect(() => {
        setOrderedNames(reorder(isReordering))
    }, [completed, habits, collection.order])

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
        setOrderedNames(reorder(v))

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
