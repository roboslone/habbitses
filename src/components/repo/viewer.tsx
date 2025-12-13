import { parseRepoContent, type Repo } from "@/lib/git";
import { useRepoContent } from "@/lib/queries";
import React from "react";
import { LoadingScreen } from "@/components/util/loading-screen";
import { ErrorView } from "@/components/util/error-view";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HabitFetcher } from "@/components/habit/fetcher";
import { HabitCard } from "@/components/habit/card";
import { RepoContext } from "./context";

interface P {
  repo: Repo;
}

export const RepoViewer: React.FC<P> = ({ repo }) => {
  const content = useRepoContent(repo, true);

  if (content.isLoading) {
    return <LoadingScreen label={`Loading ${repo.name}...`} />;
  }

  const refreshButton = (
    <Button
      variant="ghost"
      disabled={content.isFetching}
      onClick={() => void content.refetch()}
    >
      <RefreshCw className={cn({ "animate-spin": content.isFetching })} />
      Refresh
    </Button>
  );

  if (content.data) {
    const names = [...parseRepoContent(content.data)];
    return (
      <RepoContext.Provider value={{ content, names }}>
        <div className="flex flex-col items-center gap-4 p-2 pt-0 grow">
          <div className="flex flex-col items-center gap-4 w-full">
            {names.map((name) => (
              <HabitFetcher key={name} name={name} mode="active">
                <HabitCard />
              </HabitFetcher>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            {names.map((name) => (
              <HabitFetcher key={name} name={name} mode="completed">
                <HabitCard />
              </HabitFetcher>
            ))}
          </div>

          {names.length === 0 && (
            <>
              <span className="text-muted-foreground">Repository is empty</span>
              {refreshButton}
            </>
          )}

          <div className="mt-auto flex justify-center">{refreshButton}</div>
        </div>
      </RepoContext.Provider>
    );
  }

  return <ErrorView error={content.error} retry={content.refetch} />;
};
