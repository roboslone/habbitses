import { useHabit } from "@/lib/queries";
import type React from "react";
import { Loader2 } from "lucide-react";
import { HabitContext } from "./habit/context";

interface P extends React.PropsWithChildren {
  name: string;
}

export const HabitFetcher: React.FC<P> = ({ name, children }) => {
  const habit = useHabit(name);

  if (habit.data) {
    return <HabitContext value={habit.data}>{children}</HabitContext>;
  }

  return <Loader2 className="animate-spin" />;
};
