import type React from "react";
import { PageHeader } from "./page-header";
import HabitForm from "./habit-form";
import { useSaveHabit } from "@/lib/queries";

export const NewHabbitPage: React.FC = () => {
  const saveHabit = useSaveHabit();

  return (
    <>
      <PageHeader title="Start new habit" />
      <HabitForm onChange={saveHabit.mutateAsync} />
    </>
  );
};

export default NewHabbitPage;
