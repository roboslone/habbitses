import type React from "react";
import { useHabitContext } from "@/components/habit/context";
import { cn } from "@/lib/utils";
import { type Completion } from "@/proto/models/v1/models_pb";
import { formatDate } from "@/lib/dates";

const rows = Array.from(Array(7).keys());
const columns = Array.from(Array(53).keys());

const day = 24 * 60 * 60 * 1000;

const cellToDate = (now: Date, row: number, column: number): string => {
  const delta = row + column * 7;
  const d = new Date(now.getTime() - delta * day);
  return formatDate(d);
};

interface CellProps {
  row: number;
  column: number;
  date: string;
  background: string;
  completion?: Completion;
}

const Cell: React.FC<CellProps> = ({ date, background, completion }) => {
  let progress = 0;
  if (completion !== undefined) {
    progress = Math.min(1, completion.count / completion.target);
  }

  return (
    <div
      className={cn("w-3 h-3 min-w-3 min-h-3 rounded-xs", {
        "bg-card/80": progress === 0,
        [background]: progress > 0,
      })}
      style={{
        opacity: progress === 0 ? 1 : progress,
      }}
      data-date={date}
    />
  );
};

export const HabitChart: React.FC = () => {
  const { habit, color } = useHabitContext();
  const now = new Date();

  return (
    <div>
      <div className="max-w-full overflow-auto">
        <div
          data-testid={`habit-chart--${habit.name}`}
          className="flex flex-col gap-1"
        >
          {rows.map((row) => (
            <div key={row} className="flex gap-1">
              {columns.map((column) => {
                const date = cellToDate(now, row, column);
                return (
                  <Cell
                    key={`${row}-${column}`}
                    row={row}
                    column={column}
                    date={date}
                    background={color.background}
                    completion={habit.completions[date]}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
