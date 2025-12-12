import { type Habit, HabitSchema } from "@/proto/models/v1/models_pb";
import { create } from "@bufbuild/protobuf";
import React from "react";

export const HabitContext = React.createContext<Habit>(create(HabitSchema, {}));

export const useHabitContext = () => React.useContext(HabitContext);
