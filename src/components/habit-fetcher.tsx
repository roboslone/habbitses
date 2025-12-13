import { useHabit, useUpdateHabit } from "@/lib/queries";
import type React from "react";
import { HabitContext } from "./habit/context";
import { LoadingScreen } from "./util/loading-screen";
import { ErrorView } from "./util/error-view";
import { getProgress } from "@/lib/progress";
import * as colors from "@/lib/colors";

interface P extends React.PropsWithChildren {
  name: string;
  mode: "completed" | "active" | "page";
}

export const HabitFetcher: React.FC<P> = ({ name, children, mode }) => {
  const habit = useHabit(name);
  const update = useUpdateHabit(name);

  if (habit.isLoading) {
    if (mode === "completed") {
      // Loading will be shown in `active` fetcher, avoid duplication.
      return null;
    }
    return (
      <LoadingScreen label={name} className="h-40 max-w-211 border rounded" />
    );
  }

  if (habit.data) {
    const { progress, completion } = getProgress(habit.data, new Date());
    const isCompleted = completion.count >= completion.target;

    if (mode === "completed" && !isCompleted) {
      return null;
    }
    if (mode === "active" && isCompleted) {
      // Habit will be shown in `completed` fetcher, avoid duplication.
      return null;
    }

    return (
      <HabitContext
        value={{
          habit: habit.data,
          refetch: habit.refetch,
          update,
          isFetching: habit.isFetching,
          progress,
          completion,
          isCompleted,
          color: colors.forHabit(habit.data),
        }}
      >
        {children}
      </HabitContext>
    );
  }

  if (mode === "completed") {
    // Error will be shown in `active` fetcher, avoid duplication.
    return null;
  }
  return <ErrorView error={habit.error} />;
};
