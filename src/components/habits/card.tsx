import { useHabitContext } from "../habit/context";
import * as colors from "@/lib/colors";
import { cn } from "@/lib/utils";
import type React from "react";
import { HabitBreakDialog } from "./break-dialog";
import { HabitIcon } from "./icon";

export const HabitCard: React.FC = () => {
  const habit = useHabitContext();

  const color = colors.forHabit(habit);

  return (
    <div className="rounded-md border truncate w-full min-h-40 bg-card">
      <div className={cn("py-0 pl-2 flex items-center gap-2", color.text)}>
        <HabitIcon size={16} />
        {habit.name}

        <div className="ml-auto">
          <HabitBreakDialog />
        </div>
      </div>
    </div>
  );
};
