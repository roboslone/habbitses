export const orderHabits = (
    existing: Set<string>,
    completed: Set<string>,
    order: string[],
    isReordering: boolean,
): string[] => {
    const ordered: string[] = Array.from(existing)

    const idx: Record<string, number> = {}
    for (const [i, name] of order.entries()) {
        idx[name] = i
    }

    if (isReordering) {
        ordered.sort((a, b) => (idx[a] ?? 0) - (idx[b] ?? 0))
    } else {
        ordered.sort((a, b) => {
            const aCompleted = completed.has(a)
            const bCompleted = completed.has(b)
            if (aCompleted && !bCompleted) return 1
            if (!aCompleted && bCompleted) return -1
            return (idx[a] ?? 0) - (idx[b] ?? 0)
        })
    }

    return ordered
}

export const orderChanged = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return true
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return true
    }
    return false
}
