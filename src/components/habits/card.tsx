import { useHabitContext } from "../habit/context";
import * as colors from "@/lib/colors";
import { cn } from "@/lib/utils";
import type React from "react";
import { HabitIcon } from "./icon";
import { HabitDoneButton } from "./done-button";
import { HabitChart } from "./chart";
import { Link } from "@tanstack/react-router";

export const HabitCard: React.FC = () => {
  const habit = useHabitContext();

  const color = colors.forHabit(habit);

  return (
    <div className="rounded-md truncate w-full min-h-40 bg-card">
      <div className={cn("p-1 pl-2 flex items-center gap-2", color.text)}>
        <HabitIcon size={20} className="w-6" />
        <div className="flex flex-col gap-0">
          <Link to="/habits/$name" params={{ name: habit.name }}>
            {habit.name}
          </Link>
          <span className="text-xs text-stone-500">{habit.description}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <HabitDoneButton />
          {/* <HabitBreakDialog>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
            >
              <Ellipsis />
            </Button>
          </HabitBreakDialog> */}
        </div>
      </div>

      <div className="flex items-center justify-center w-full">
        <HabitChart />
      </div>
    </div>
  );
};
