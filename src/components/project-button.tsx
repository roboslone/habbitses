import { GitHubIcon } from "@/components/github-icon";
import { Button } from "@/components/ui/button";
import type React from "react";

export const ProjectButton: React.FC<React.ComponentProps<typeof Button>> = (
  props
) => (
  <a href="https://github.com/roboslone/habbitses" target="_blank">
    <Button variant="ghost" size="icon-lg" {...props}>
      <GitHubIcon inverted className="h-4 w-4" />
    </Button>
  </a>
);
