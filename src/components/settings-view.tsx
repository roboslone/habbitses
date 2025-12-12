import React from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { AccountBadge } from "@/components/auth/account-chip";
import { RepoField } from "./repo-field";
import { useSelectedRepo } from "@/lib/git";
import { Label } from "./ui/label";

export const SettingsView: React.FC = () => {
  const [repo, setRepo] = useSelectedRepo();

  return (
    <div data-testid="settings-page" className="p-5 flex flex-col gap-5">
      <div className="flex items-center gap-2 justify-between">
        <AccountBadge />
        <LogoutButton variant="outline" className="w-fit" />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Repository</Label>
        <RepoField value={repo} onChange={setRepo} />
      </div>
    </div>
  );
};
