import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, RefreshCcw } from "lucide-react";
import type React from "react";

type P = React.PropsWithChildren & {
  title?: string;
  error: Error | null | undefined;
  retry?: () => Promise<unknown>;
};

export const ErrorView: React.FC<P> = ({ title, error, retry, children }) => {
  error ??= new Error("Unknown error");

  return (
    <div className="w-full h-full flex items-center justify-center max-w-full">
      <div className="flex flex-col gap-4">
        <Alert variant="destructive" className="p-0 overflow-hidden">
          <AlertTitle className="flex items-center gap-2 p-2">
            <AlertCircleIcon size={14} />
            {title ?? error.name}
          </AlertTitle>
          <AlertDescription>
            <code className="bg-muted relative p-2 font-mono text-sm w-full overflow-auto">
              {error.message}
            </code>
          </AlertDescription>
        </Alert>

        {children}

        {retry !== undefined && (
          <Button variant="outline" onClick={() => void retry()}>
            <RefreshCcw />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};
