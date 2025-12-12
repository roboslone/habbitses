import { useHabitContext } from "../habit/context";
import * as colors from "@/lib/colors";
import { cn } from "@/lib/utils";
import type React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Check } from "lucide-react";

export const HabitDoneButton: React.FC = () => {
  const habit = useHabitContext();
  const color = colors.forHabit(habit);

  const className = cn(color.text);

  if (habit.dailyTarget === 1) {
    return (
      <Button variant="ghost" className={className}>
        <Check />
        Done
      </Button>
    );
  }

  return (
    <Button variant="ghost" className={className}>
      <ArrowUp />
      Increase
    </Button>
  );
};
