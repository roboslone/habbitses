import { useHabitContext } from "@/components/habit/context";
import { cn } from "@/lib/utils";
import type React from "react";
import { HabitIcon } from "./icon";
import { HabitChart } from "./chart";
import { Link } from "@tanstack/react-router";
import { CompletionButtons } from "./buttons";
import { HabitProgress } from "./progress";

export const HabitCard: React.FC = () => {
  const { habit, color, isCompleted } = useHabitContext();

  return (
    <div className="habit-card rounded truncate w-full min-h-40 max-w-211 flex flex-col gap-1">
      <div
        className={cn(
          "habit-card--header",
          "flex flex-col gap-1 bg-card rounded truncate pt-1",
          color.text
        )}
      >
        <div
          className={cn("flex items-center gap-1 w-full pl-2 pr-1", {
            "opacity-50": isCompleted,
          })}
        >
          <Link
            to="/habits/$name"
            params={{ name: habit.name }}
            className="grow"
          >
            <div className="flex items-center gap-2 grow">
              <HabitIcon size={20} className="w-6" />
              <div className="flex flex-col gap-0">
                <span
                  className={cn({
                    "line-through": isCompleted,
                  })}
                >
                  {habit.name}
                </span>
                <span className="text-xs text-stone-500">
                  {habit.description}
                </span>
              </div>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <CompletionButtons />
          </div>
        </div>

        <HabitProgress className="opacity-50" />
      </div>

      <HabitChart />
    </div>
  );
};
