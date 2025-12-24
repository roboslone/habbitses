import { describe, expect, test } from "vitest"

import { orderHabits } from "./ordering"

describe("orderHabits", () => {
    const existing = new Set(["pending", "completed", "other-pending"])
    const completed = new Set(["completed"])
    const order = ["other-pending", "completed", "pending", "does-not-exist"]

    test("isReordering = true", () => {
        expect(orderHabits(existing, completed, order, true)).toEqual([
            "other-pending",
            "completed",
            "pending",
        ])
    })

    test("isReordering = false", () => {
        expect(orderHabits(existing, completed, order, false)).toEqual([
            "other-pending",
            "pending",
            "completed",
        ])
    })
})
