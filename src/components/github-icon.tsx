import type React from "react";
import GitHubLogo from "@/assets/github.svg?url";
import { cn } from "@/lib/utils";

interface P extends React.HTMLAttributes<HTMLImageElement> {
  inverted?: boolean;
}

export const GitHubIcon: React.FC<P> = (props) => {
  const { inverted, className, ...rest } = props;

  return (
    <img
      src={GitHubLogo}
      {...rest}
      className={cn("h-6 w-6", { invert: inverted }, className)}
    />
  );
};
