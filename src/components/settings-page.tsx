import { useCurrentAccount } from "@/lib/queries";
import type React from "react";
import { LogoutButton } from "./logout-button";

export const SettingsPage: React.FC = () => {
  const username = useCurrentAccount();

  return (
    <div data-testid="settings-page" className="p-2 flex flex-col gap-2">
      <LogoutButton variant="outline" className="w-fit" />
      <pre>{JSON.stringify(username.data, null, 4)}</pre>
      <pre>{JSON.stringify(username.error, null, 4)}</pre>
    </div>
  );
};
