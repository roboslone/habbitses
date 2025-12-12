import { useHabit } from "@/lib/queries";
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

  if (habit.isLoading) {
    return <LoadingScreen label={name} />;
  }

  if (habit.data) {
    const { progress, completion } = getProgress(habit.data, new Date());

    return (
      <HabitContext
        value={{
          habit: habit.data,
          refetch: habit.refetch,
          isFetching: habit.isFetching,
          progress,
          completion,
          color: colors.forHabit(habit.data),
        }}
      >
        {children}
      </HabitContext>
    );
  }

  return <ErrorView error={habit.error} />;
};
