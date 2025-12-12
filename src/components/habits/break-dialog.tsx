import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Undo2 } from "lucide-react";
import { useHabitContext } from "@/components/habit/context";
import { cn } from "@/lib/utils";
import { HabitIcon } from "./icon";
import { useBreakHabit, useRefetchRepoContent } from "@/lib/queries";
import { toast } from "sonner";
import { HabitDescription } from "./description";

export const HabitBreakDialog: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  const { habit, color } = useHabitContext();
  const breakHabit = useBreakHabit();
  const refetchRepoContent = useRefetchRepoContent();

  const handleBreak = () => {
    toast.promise(
      breakHabit
        .mutateAsync(habit)
        .then(() => setOpen(false))
        .then(() => refetchRepoContent()),
      {
        loading: "Breaking a habit...",
        success: () => ({
          message: "Habit is broken!",
          description: habit.name,
        }),
        error: (e: Error) => ({
          message: "Failed to break a habit",
          description: `${habit.name}: ${e.message}`,
        }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>Break a habit?</DialogTitle>
        <DialogDescription>
          Habit will be deleted, but its data will be preserved in GitHub log.
        </DialogDescription>

        <div className="flex flex-col gap-2">
          <h1 className={cn("flex items-center gap-2 text-xl", color.text)}>
            <HabitIcon />
            {habit.name}
          </h1>
          <HabitDescription />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={breakHabit.isPending}
          >
            <Undo2 />
            Cancel
          </Button>
          <Button
            variant="outline"
            disabled={breakHabit.isPending}
            onClick={handleBreak}
          >
            <Trash2 className="text-rose-500" />
            Break
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
