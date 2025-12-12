import {
  Completion_ButtonOptionsSchema,
  CompletionSchema,
  HabitSchema,
  type Completion,
  type Completion_ButtonOptions,
} from "@/proto/models/v1/models_pb";
import type React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUp, Check } from "lucide-react";
import { clone, create } from "@bufbuild/protobuf";
import { useHabitContext } from "@/components/habit/context";
import { cn } from "@/lib/utils";
import { useUpdateHabit } from "@/lib/queries";
import { formatDate } from "@/lib/dates";
import { toast } from "sonner";

interface P extends React.ComponentProps<typeof Button> {
  options?: Completion_ButtonOptions;
}

const defaultOptions = create(Completion_ButtonOptionsSchema, {
  kind: { case: "complete", value: true },
});

const applyButton = (
  completion: Completion,
  options: Completion_ButtonOptions
) => {
  if (options.kind.case === "delta") {
    completion.count += options.kind.value;
  } else if (options.kind.case === "percentage") {
    completion.count += Math.ceil(
      (options.kind.value / 100) * completion.target
    );
  } else if (options.kind.case === "complete") {
    completion.count = completion.target;
  } else if (options.kind.case === "set") {
    completion.count = options.kind.value;
  }
};

export const CompletionButton: React.FC<P> = ({
  options = defaultOptions,
  children,
  ...rest
}) => {
  const { habit, color } = useHabitContext();
  const saveHabit = useUpdateHabit(habit.name);

  const handleClick = () => {
    const next = clone(HabitSchema, habit);
    const date = formatDate(new Date());
    const completion =
      next.completions[date] ??
      create(CompletionSchema, { target: next.dailyTarget });

    applyButton(completion, options);
    next.completions[date] = completion;

    console.info("button click", { habit, next, options, completion });

    toast.promise(saveHabit.mutateAsync(next), {
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
  if (kind.case === "delta") {
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
      disabled={rest.disabled || saveHabit.isPending}
      onClick={handleClick}
    >
      {children ?? content}
    </Button>
  );
};
