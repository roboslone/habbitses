import React from "react";
import { Toaster } from "@/components/ui/sonner";
import AuthWall from "@/components/auth/auth-wall";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "@/lib/queries";
import { AccountWall } from "@/components/auth/account-wall";
import { Outlet } from "@tanstack/react-router";
import { LoadingScreen } from "./components/util/loading-screen";

export const Layout: React.FC = () => (
  <>
    <React.Suspense fallback={<LoadingScreen />}>
      <QueryClientProvider client={client}>
        <AuthWall>
          <AccountWall>
            <Outlet />
          </AccountWall>
        </AuthWall>
      </QueryClientProvider>
      <Toaster />
    </React.Suspense>
  </>
);

export default Layout;
