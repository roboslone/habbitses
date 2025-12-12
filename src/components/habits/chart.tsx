import type React from "react";
import { useHabitContext } from "../habit/context";
import { cn } from "@/lib/utils";

const rows = Array.from(Array(7).keys());
const columns = Array.from(Array(53).keys());

const day = 24 * 60 * 60 * 1000;

const cellToDate = (now: Date, row: number, column: number): string => {
  const delta = (row + 1) * (column + 1) - 1;
  const d = new Date(now.getTime() - delta * day);

  return `${d.getFullYear()}-${d.getMonth().toString().padStart(2, "0")}-${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;
};

export const HabitChart: React.FC = () => {
  const habit = useHabitContext();
  const now = new Date();

  return (
    <div
      data-testid={`habit-chart--${habit.name}`}
      className="bg-card flex flex-col gap-1 overflow-auto p-1 rounded-sm"
    >
      {rows.map((row) => (
        <div key={row} className="flex gap-1">
          {columns.map((column) => (
            <div
              key={column}
              className={cn(
                "w-3 h-3 min-w-3 min-h-3 rounded-xs bg-background/80"
              )}
              data-date={cellToDate(now, row, column)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
