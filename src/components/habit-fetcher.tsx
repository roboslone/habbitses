import { useHabit } from "@/lib/queries";
import type React from "react";
import { HabitContext } from "./habit/context";
import { LoadingScreen } from "./util/loading-screen";
import { ErrorView } from "./util/error-view";

interface P extends React.PropsWithChildren {
  name: string;
}

export const HabitFetcher: React.FC<P> = ({ name, children }) => {
  const habit = useHabit(name);

  if (habit.isLoading) {
    return <LoadingScreen label={name} />;
  }

  if (habit.data) {
    return <HabitContext value={habit.data}>{children}</HabitContext>;
  }

  return <ErrorView error={habit.error} />;
};
