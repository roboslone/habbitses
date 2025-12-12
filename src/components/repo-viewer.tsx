import { parseRepoContent, type Repo } from "@/lib/git";
import { useRepoContent } from "@/lib/queries";
import type React from "react";
import { LoadingScreen } from "./util/loading-screen";
import { ErrorView } from "./util/error-view";
import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { HabitFetcher } from "./habit-fetcher";
import { HabitCard } from "./habits/card";

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
    if (content.data.tree.length === 0) {
      return (
        <div className="p-2 flex flex-col items-center justify-center gap-2">
          <span className="text-muted-foreground">Repository is empty</span>
          {refreshButton}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 p-2 pt-0 grow">
        {[...parseRepoContent(content.data)].map((name) => (
          <HabitFetcher key={name} name={name}>
            <HabitCard />
          </HabitFetcher>
        ))}

        <div className="mt-auto flex justify-center">{refreshButton}</div>
      </div>
    );
  }

  return <ErrorView error={content.error} retry={content.refetch} />;
};
