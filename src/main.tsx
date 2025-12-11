import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "./components/ui/sonner";
import AuthWall from "./components/auth-wall";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./lib/queries";
import { SettingsView } from "./components/settings-view";

createRoot(document.getElementById("root")!).render(
  <>
    <QueryClientProvider client={client}>
      <AuthWall>
        <SettingsView />
        <Toaster />
      </AuthWall>
    </QueryClientProvider>
  </>
);
