import {
  Completion_ButtonOptionsSchema,
  CompletionSchema,
  HabitSchema,
  type Completion,
  type Completion_ButtonOptions,
} from "@/proto/models/v1/models_pb";
import type React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUp, Check, Undo2 } from "lucide-react";
import { clone, create } from "@bufbuild/protobuf";
import { useHabitContext } from "@/components/habit/context";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/dates";
import { toast } from "sonner";

interface P extends React.ComponentProps<typeof Button> {
  options?: Completion_ButtonOptions;
  preview?: boolean;
}

const defaultOptions = create(Completion_ButtonOptionsSchema, {
  kind: { case: "complete", value: true },
});

const applyButton = (
  completion: Completion,
  options: Completion_ButtonOptions
) => {
  switch (options.kind.case) {
    case "delta":
      completion.count += options.kind.value;
      return;
    case "percentage":
      completion.count += Math.ceil(
        (options.kind.value / 100) * completion.target
      );
      return;
    case "complete":
      completion.count = completion.target;
      return;
    case "set":
      completion.count = options.kind.value;
      return;
  }
};

export const CompletionButton: React.FC<P> = ({
  options = defaultOptions,
  children,
  preview,
  ...rest
}) => {
  const { habit, color, update } = useHabitContext();

  const handleClick = () => {
    if (preview) return;

    const next = clone(HabitSchema, habit);
    const date = formatDate(new Date());

    if (options.kind.case === undefined) {
      delete next.completions[date];
    } else {
      const completion =
        next.completions[date] ??
        create(CompletionSchema, { target: next.dailyTarget });

      applyButton(completion, options);
      next.completions[date] = completion;
    }

    toast.promise(update.mutateAsync(next), {
      loading: "Updating habit...",
      success: "Habit updated",
      error: (e: Error) => ({
        message: "Update failed",
        description: e.message,
      }),
    });
  };

  const { kind = defaultOptions.kind } = options;
  let className = cn(color.text, rest.className);

  let content = null;
  if (kind.case === undefined) {
    content = (
      <>
        <Undo2 />
        <span>Reset</span>
      </>
    );
  } else if (kind.case === "delta") {
    className = cn(className, "gap-1");
    content = (
      <>
        <ArrowUp />
        <span>+{kind.value}</span>
      </>
    );
  } else if (kind.case === "percentage") {
    className = cn(className, "gap-1");
    content = (
      <>
        <ArrowUp />
        <span>+{kind.value}%</span>
      </>
    );
  } else if (kind.case === "complete") {
    content = (
      <>
        <Check />
        Done
      </>
    );
  } else if (kind.case === "set") {
    content = (
      <>
        <ArrowRight />
        {kind.value}
      </>
    );
  }

  return (
    <Button
      variant="ghost"
      {...rest}
      className={className}
      disabled={rest.disabled || update.isPending}
      onClick={handleClick}
    >
      {children ?? content}
    </Button>
  );
};
