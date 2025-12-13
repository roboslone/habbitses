import type React from "react";
import { PageHeader } from "@/components/page-header";
import HabitForm from "./form";
import { useNewHabit } from "@/lib/queries";

export const NewHabbitPage: React.FC = () => {
  const saveHabit = useNewHabit();

  return (
    <>
      <PageHeader title="Start new habit" />
      <HabitForm onChange={saveHabit.mutateAsync} />
    </>
  );
};

export default NewHabbitPage;
