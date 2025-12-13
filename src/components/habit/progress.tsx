import type React from "react";
import { useHabitContext } from "@/components/habit/context";
import { Progress } from "@/components/ui/progress";

export const HabitProgress: React.FC<React.ComponentProps<typeof Progress>> = (
  props
) => {
  const { progress } = useHabitContext();
  return <Progress value={progress} {...props} />;
};
