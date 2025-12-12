import type React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ProjectButton } from "@/components/project-button";

interface P {
  title: React.ReactNode;
  buttonLeft?: React.ReactNode;
  buttonRight?: React.ReactNode;
}

export const PageHeader: React.FC<P> = ({ title, buttonLeft, buttonRight }) => (
  <div data-testid="page-header" className="flex items-center gap-2 p-2">
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
);
