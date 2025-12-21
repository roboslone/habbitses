import { PageHeader } from "@/components/page/header"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Link } from "@tanstack/react-router"
import { Cog, Plus } from "lucide-react"
import type React from "react"

import { Page } from "../page/page"
import { HabitList } from "./list"

export const HabitListPage: React.FC = () => {
    return (
        <>
            <PageHeader
                title="Habbitses"
                buttonLeft={
                    <Link to="/settings">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon-lg">
                                    <Cog />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Settings</TooltipContent>
                        </Tooltip>
                    </Link>
                }
                buttonRight={
                    <Link to="/habits/new">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon-lg">
                                    <Plus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Start new habbit</TooltipContent>
                        </Tooltip>
                    </Link>
                }
            />

            <Page data-testid="habit-list-page">
                <HabitList />
            </Page>
        </>
    )
}

export default HabitListPage
