import {
  type Completion,
  CompletionSchema,
  type Habit,
  HabitSchema,
} from "@/proto/models/v1/models_pb";
import { create } from "@bufbuild/protobuf";
import React from "react";
import * as colors from "@/lib/colors";

interface S {
  habit: Habit;
  refetch: () => Promise<unknown>;
  isFetching: boolean;
  color: colors.Options;
  completion: Completion;
  progress: number;
}

export const HabitContext = React.createContext<S>({
  habit: create(HabitSchema, {}),
  refetch: async () => null,
  isFetching: false,
  color: colors.defaultOption,
  completion: create(CompletionSchema, {
    count: 0,
    target: 1,
  }),
  progress: 0,
});

export const useHabitContext = () => React.useContext(HabitContext);
