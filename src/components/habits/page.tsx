import { rHabit } from "@/routes";
import type React from "react";
import { HabitFetcher } from "@/components/habit-fetcher";
import { HabitView } from "./view";

export const HabitPage: React.FC = () => {
  const { name } = rHabit.useRouteContext();

  return (
    <HabitFetcher name={name}>
      <HabitView />
    </HabitFetcher>
  );
};

export default HabitPage;
