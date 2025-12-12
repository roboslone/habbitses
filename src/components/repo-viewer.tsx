import type { Repo } from "@/lib/git";
import { useRepoContent } from "@/lib/queries";
import type React from "react";
import { LoadingScreen } from "./util/loading-screen";
import { ErrorView } from "./util/error-view";
import { FileIcon, Folder } from "lucide-react";

interface P {
  repo: Repo;
}

export const RepoViewer: React.FC<P> = ({ repo }) => {
  const content = useRepoContent(repo);

  if (content.isPending) {
    return <LoadingScreen label={`Loading ${repo.name}...`} />;
  }

  if (content.data) {
    if (content.data.tree.length === 0) {
      return (
        <div className="p-2 flex items-center justify-center text-muted-foreground">
          Repository is empty.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        {content.data.tree.map((e) => (
          <div
            key={e.path}
            className="flex items-center gap-1 font-mono text-xs"
          >
            <div className="text-muted-foreground">
              {e.type === "tree" && <Folder size={12} />}
              {e.type === "blob" && <FileIcon size={12} />}
            </div>
            <span>{e.path}</span>
          </div>
        ))}
      </div>
    );
  }

  return <ErrorView error={content.error} retry={content.refetch} />;
};
