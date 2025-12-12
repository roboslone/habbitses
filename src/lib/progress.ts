import { CompletionSchema, type Habit } from "@/proto/models/v1/models_pb";
import { formatDate } from "./dates";
import { create } from "@bufbuild/protobuf";

const defaultCompletion = create(CompletionSchema, {
  count: 0,
  target: 1,
});

export const getProgress = (habit: Habit, date: Date) => {
  const completion = habit.completions[formatDate(date)] ?? defaultCompletion;

  let progress = 0;
  if (completion.target !== 0) {
    progress = (completion.count / completion.target) * 100;
  }

  return { completion, progress };
};
