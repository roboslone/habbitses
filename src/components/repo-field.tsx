import type { Repo } from "@/lib/git";
import React from "react";
import { Button } from "./ui/button";
import { BookMarked, ChevronsUpDown } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { RepoPicker } from "./repo-picker";
import { DialogDescription } from "@radix-ui/react-dialog";

interface P {
  value: Repo | undefined;
  onChange: (r: Repo) => void;
}

export const RepoField: React.FC<P> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);

  const handlePick = (r: Repo) => {
    onChange(r);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="w-full flex items-center gap-2">
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" className="justify-between grow">
            {value === undefined ? (
              <span className="text-muted-foreground">Repo not selected</span>
            ) : (
              <div className="flex items-center gap-2">
                <BookMarked className="text-emerald-600" />
                {value.name}
              </div>
            )}
            <ChevronsUpDown />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogTitle>Select a repository</DialogTitle>
        <DialogDescription>
          Pick an <strong>owned private</strong> repository to store your habit
          data.
        </DialogDescription>
        <div className="h-[50vh]">
          <RepoPicker onPick={handlePick} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
