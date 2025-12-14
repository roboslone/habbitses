import { ProjectButton } from "@/components/project-button"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { Home } from "lucide-react"
import type React from "react"

interface P {
    title?: React.ReactNode
    buttonLeft?: React.ReactNode
    buttonRight?: React.ReactNode
}

export const PageHeader: React.FC<P> = ({ title = "Habbitses", buttonLeft, buttonRight }) => (
    <div data-testid="page-header" className="flex items-center gap-2 p-2 w-full">
        {buttonLeft ?? (
            <Link to="/">
                <Button variant="ghost" size="icon-lg">
                    <Home />
                </Button>
            </Link>
        )}

        <h1 className="mx-auto">{title}</h1>

        {buttonRight ?? <ProjectButton />}
    </div>
)
