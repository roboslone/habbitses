import type React from "react";
import { Button } from "./ui/button";
import { useCurrentAccount } from "@/lib/queries";
import { Loader2, TriangleAlert } from "lucide-react";
import { Tooltip, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";

export const AccountBadge: React.FC = () => {
  const account = useCurrentAccount();

  if (account.isPending) {
    return <Loader2 className="animate-spin" />;
  }

  if (account.data) {
    return (
      <Button variant="outline" className="px-0 py-0 truncate pr-2">
        <img src={account.data.avatarURL} className="h-full aspect-square" />
        {account.data.login}
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="destructive">
          <TriangleAlert />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{JSON.stringify(account.error)}</TooltipContent>
    </Tooltip>
  );
};
