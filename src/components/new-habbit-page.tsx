import type React from "react";
import { PageHeader } from "./page-header";
import HabitForm from "./habit-form";
import { useNewHabit } from "@/lib/queries";

export const NewHabbitPage: React.FC = () => {
  const mut = useNewHabit()

  return (
    <>
      <PageHeader title="Start new habit" />

      <HabitForm onChange={mut.mutateAsync} />
    </>
  );
};

export default NewHabbitPage;
