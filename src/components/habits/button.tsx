import {
  Completion_ButtonOptionsSchema,
  type Completion_ButtonOptions,
} from "@/proto/models/v1/models_pb";
import type React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Check } from "lucide-react";
import { create } from "@bufbuild/protobuf";
import { useHabitContext } from "@/components/habit/context";
import { cn } from "@/lib/utils";

interface P extends React.ComponentProps<typeof Button> {
  options?: Completion_ButtonOptions;
}

const defaultOptions = create(Completion_ButtonOptionsSchema, {
  kind: { case: "delta", value: 1 },
});

export const CompletionButton: React.FC<P> = ({
  options = defaultOptions,
  ...rest
}) => {
  const { habit, color } = useHabitContext();

  const { kind = defaultOptions.kind } = options;
  let className = cn(color.text, rest.className);

  let content = null;
  if (
    (kind.case === "delta" && kind.value >= habit.dailyTarget) ||
    (kind.case === "percentage" && kind.value >= 100)
  ) {
    content = (
      <>
        <Check />
        <span>Complete</span>
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
  } else {
    className = cn(className, "gap-1");
    content = (
      <>
        <ArrowUp />
        <span>+{kind.value}%</span>
      </>
    );
  }

  return (
    <Button variant="ghost" {...rest} className={className}>
      {content}
    </Button>
  );
};
