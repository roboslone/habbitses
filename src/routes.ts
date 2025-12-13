import {
    createHashHistory,
    createRootRoute,
    createRoute,
    createRouter,
} from "@tanstack/react-router"
import React from "react"

import { LoadingScreen } from "./components/util/loading-screen"

const history = createHashHistory()

const common = {
    getParentRoute: () => rRoot,
    pendingComponent: LoadingScreen,
}

export const rRoot = createRootRoute({
    component: React.lazy(() => import("@/layout")),
    pendingComponent: LoadingScreen,
})

export const rHome = createRoute({
    ...common,
    path: "/",
    component: React.lazy(() => import("@/components/home")),
})

export const rSettings = createRoute({
    ...common,
    path: "/settings",
    component: React.lazy(() => import("@/components/settings-page")),
})

export const rNewHabit = createRoute({
    ...common,
    path: "/habits/new",
    component: React.lazy(() => import("@/components/habit/new-habbit-page")),
})

export const rHabit = createRoute({
    ...common,
    path: "/habits/$name",
    component: React.lazy(() => import("@/components/habit/page")),
})

const routeTree = rRoot.addChildren([rHome, rSettings, rNewHabit, rHabit])

export const router = createRouter({
    history,
    routeTree,
})

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
}
