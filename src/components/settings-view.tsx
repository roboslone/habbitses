import type React from "react";
import { LogoutButton } from "./logout-button";
import { AccountBadge } from "./account-chip";

export const SettingsView: React.FC = () => {
  return (
    <div data-testid="settings-page" className="p-2 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <AccountBadge />
        <LogoutButton variant="outline" className="w-fit" />
      </div>
    </div>
  );
};
