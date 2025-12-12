import React from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { AccountBadge } from "@/components/auth/account-chip";
import { RepoSelector } from "./repo-selector";
import { Label } from "./ui/label";
import { PageHeader } from "./page-header";

export const SettingsPage: React.FC = () => {
  return (
    <>
      <PageHeader title="Settings" />

      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-col gap-2">
          <Label>Account</Label>
          <div className="flex items-center gap-2">
            <AccountBadge />
            <LogoutButton variant="destructive" className="w-fit" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Repository</Label>
          <RepoSelector />
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
