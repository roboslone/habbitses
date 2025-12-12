import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React from "react";

export const rRoot = createRootRoute({
  component: React.lazy(() => import("@/layout")),
});

export const rHome = createRoute({
  getParentRoute: () => rRoot,
  path: "/",
  component: React.lazy(() => import("@/components/home")),
});

export const rSettings = createRoute({
  getParentRoute: () => rRoot,
  path: "/settings",
  component: React.lazy(() => import("@/components/settings-page")),
});

export const rNewHabit = createRoute({
  getParentRoute: () => rRoot,
  path: "/habits/new",
  component: React.lazy(() => import("@/components/new-habbit-page")),
});

export const rHabit = createRoute({
  getParentRoute: () => rRoot,
  path: "/habits/$name",
  beforeLoad: ({ params }) => ({
    name: params.name,
  }),
  component: React.lazy(() => import("@/components/habits/page")),
});

const routeTree = rRoot.addChildren([rHome, rSettings, rNewHabit, rHabit]);

export const router = createRouter({ routeTree, basepath: "/habbitses/" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
