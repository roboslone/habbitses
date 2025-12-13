import { useHabit, useUpdateHabit } from "@/lib/queries";
import type React from "react";
import { HabitContext } from "./habit/context";
import { LoadingScreen } from "./util/loading-screen";
import { ErrorView } from "./util/error-view";
import { getProgress } from "@/lib/progress";
import * as colors from "@/lib/colors";

interface P extends React.PropsWithChildren {
  name: string;
}

export const HabitFetcher: React.FC<P> = ({ name, children }) => {
  const habit = useHabit(name);
  const update = useUpdateHabit(name);

  if (habit.isLoading) {
    return <LoadingScreen label={name} className="h-40 border rounded" />;
  }

  if (habit.data) {
    const { progress, completion } = getProgress(habit.data, new Date());

    return (
      <HabitContext
        value={{
          habit: habit.data,
          refetch: habit.refetch,
          update,
          isFetching: habit.isFetching,
          progress,
          completion,
          isCompleted: completion.count >= completion.target,
          color: colors.forHabit(habit.data),
        }}
      >
        {children}
      </HabitContext>
    );
  }

  return <ErrorView error={habit.error} />;
};
