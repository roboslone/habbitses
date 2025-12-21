import { formatDate } from "@/lib/dates"
import React from "react"

import { DateContext } from "./context"

export const CurrentDateProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [date, setDate] = React.useState(new Date())
    const dateStr = formatDate(date)

    React.useEffect(() => {
        const interval = setInterval(() => {
            const next = new Date()
            const nextStr = formatDate(next)
            if (nextStr !== dateStr) {
                setDate(next)
            }
        }, 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    return <DateContext.Provider value={date}>{children}</DateContext.Provider>
}
