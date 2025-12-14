import { PageHeader } from "@/components/page-header"
import type React from "react"

import { LoadingScreen } from "./loading-screen"

export const LoadingPage: React.FC = () => (
    <>
        <PageHeader title="Habbitses" />
        <LoadingScreen />
    </>
)
