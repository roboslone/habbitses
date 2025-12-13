import GitHubLogo from "@/assets/github.svg?url";
import { useRefreshRepos, useRepos } from "@/lib/queries";
import React from "react";
import { LoadingScreen } from "@/components/util/loading-screen";
import { ErrorView } from "@/components/util/error-view";
import { Button } from "@/components/ui/button";
import {
  BookMarked,
  BookPlus,
  Filter,
  LockOpen,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Repo } from "@/lib/git";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";

interface P {
  onPick: (r: Repo) => void;
}

export const RepoPicker: React.FC<P> = ({ onPick }) => {
  const repos = useRepos();
  const refresh = useRefreshRepos();
  const [query, setQuery] = React.useState<string | undefined>(undefined);

  if (repos.isPending) {
    return <LoadingScreen label="Loading repos..." />;
  }

  if (repos.data) {
    if (repos.data.length === 0) {
      return (
        <div className="flex flex-col gap-4 items-center justify-center h-full">
          <p className="text-muted-foreground text-center">
            No repositories found. GitHub app needs to be installed in at least
            one <strong>private</strong> repository.
          </p>
          <Separator />
          <a href="https://github.com/new" target="_self" className="w-full">
            <Button variant="outline" size="lg" className="w-full">
              <BookPlus className="text-emerald-600" />
              Create new repository
            </Button>
          </a>
          <a
            href="https://github.com/apps/habbitses"
            target="_self"
            className="w-full"
          >
            <Button variant="outline" size="lg" className="w-full">
              <img src={GitHubLogo} className="h-4 w-4 invert" />
              Install GitHub app
            </Button>
          </a>
        </div>
      );
    }

    let filtered: Repo[] = repos.data;
    if (query !== undefined) {
      filtered = repos.data.filter((r) => r.name.toLowerCase().includes(query));
    }

    return (
      <div className="flex flex-col max-h-full gap-2">
        <div className="flex items-center gap-2 sticky top-0 bg-background">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value.toLowerCase().trim())}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (filtered.length >= 1) {
                  onPick(filtered[0]);
                }
              }
            }}
            placeholder="Name"
          />

          <Button variant="outline" onClick={() => setQuery("")}>
            <Filter className="text-muted-foreground" />
            {filtered.length}
          </Button>

          <Button
            variant="outline"
            onClick={() => void refresh()}
            disabled={repos.isFetching}
            className="w-fit"
          >
            <RefreshCw className={cn({ "animate-spin": repos.isFetching })} />
          </Button>
        </div>

        <div className="flex flex-col gap-2 overflow-auto">
          {filtered.map((repo) => (
            <Button
              key={repo.id}
              variant="secondary"
              size="lg"
              className="cursor-pointer justify-start"
              onClick={() => onPick(repo)}
            >
              {repo.private ? (
                <BookMarked className="text-emerald-600" />
              ) : (
                <LockOpen className="text-red-600" />
              )}
              {repo.name}
            </Button>
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-center text-muted-foreground p-2">
                No repositories to pick from.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <ErrorView error={repos.error} retry={repos.refetch} />;
};
