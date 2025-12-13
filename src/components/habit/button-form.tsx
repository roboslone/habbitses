import React from "react";
import { useHabitContext } from "./context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ellipsis, Loader2, Plus, Trash2 } from "lucide-react";
import { CompletionButton } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NewButtonForm } from "./new-button-form";
import { clone } from "@bufbuild/protobuf";
import { HabitSchema } from "@/proto/models/v1/models_pb";
import { toast } from "sonner";

export const ButtonForm: React.FC = () => {
  const { habit, update } = useHabitContext();

  const [addMode, setAddMode] = React.useState(false);

  const handleDelete = (idx: number) => {
    const copy = clone(HabitSchema, habit);
    if (copy.buttons === undefined) {
      return;
    }

    copy.buttons = copy.buttons.filter((_, i) => i !== idx);

    toast.promise(update.mutateAsync(copy), {
      error: (e: Error) => ({
        message: "Failed to delete button",
        description: e.message,
      }),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Ellipsis />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Manage habit buttons</DialogTitle>
        <DialogDescription>
          Add or delete custom buttons for this habit
        </DialogDescription>

        {addMode ? (
          <NewButtonForm onClose={() => setAddMode(false)} />
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {habit.buttons.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-1"
                >
                  <CompletionButton options={b} preview variant="outline" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(idx)}
                        disabled={update.isPending}
                      >
                        {update.isPending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Trash2 />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Delete</TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => setAddMode(true)}>
                <Plus />
                Add custom button
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
