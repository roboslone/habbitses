import { useHabitContext } from "@/components/habit/context";
import { cn } from "@/lib/utils";
import type React from "react";
import { HabitIcon } from "./icon";
import { HabitChart } from "./chart";
import { Link } from "@tanstack/react-router";
import { CompletionButtons } from "./buttons";
import { HabitProgress } from "./progress";

export const HabitCard: React.FC = () => {
  const { habit, color } = useHabitContext();

  return (
    <div className="habit-card rounded truncate w-full min-h-40 max-w-211 flex flex-col gap-1">
      <div
        className={cn(
          "habit-card--header",
          "flex flex-col gap-1 bg-card rounded truncate pt-1",
          color.text
        )}
      >
        <div className="flex items-center gap-2 w-full pl-2 pr-1">
          <HabitIcon size={20} className="w-6" />
          <div className="flex flex-col gap-0">
            <Link to="/habits/$name" params={{ name: habit.name }}>
              {habit.name}
            </Link>
            <span className="text-xs text-stone-500">{habit.description}</span>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <CompletionButtons />
          </div>
        </div>

        <HabitProgress />
      </div>

      <HabitChart />
    </div>
  );
};
