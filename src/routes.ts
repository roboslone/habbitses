import {
    createHashHistory,
    createRootRoute,
    createRoute,
    createRouter,
} from "@tanstack/react-router"
import React from "react"

import { LoadingPage } from "./components/util/loading-page"

const history = createHashHistory()

const common = {
    getParentRoute: () => rRoot,
    pendingComponent: LoadingPage,
    preload: true,
}

export const rRoot = createRootRoute({
    component: React.lazy(() => import("@/layout")),
    pendingComponent: LoadingPage,
})

export const rSettings = createRoute({
    ...common,
    path: "/settings",
    component: React.lazy(() => import("@/components/settings-page")),
    preload: true,
})

export const rHabitList = createRoute({
    ...common,
    path: "/",
    component: React.lazy(() => import("@/components/habit/list-page")),
})

export const rNewHabit = createRoute({
    ...common,
    path: "/habits/new",
    component: React.lazy(() => import("@/components/habit/new-page")),
})

export const rHabit = createRoute({
    ...common,
    path: "/habits/$name",
    component: React.lazy(() => import("@/components/habit/page")),
})

export const rTagList = createRoute({
    ...common,
    path: "/tags",
    component: React.lazy(() => import("@/components/tag/list-page")),
})

export const rNewTag = createRoute({
    ...common,
    path: "/tags/new",
    component: React.lazy(() => import("@/components/tag/new-page")),
})

const routeTree = rRoot.addChildren([rHabitList, rSettings, rNewHabit, rHabit, rTagList, rNewTag])

export const router = createRouter({
    history,
    routeTree,
    defaultPreload: "render",
})

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
}
