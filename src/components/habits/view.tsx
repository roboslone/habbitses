import type React from "react";
import { useHabitContext } from "../habit/context";
import { HabitIcon } from "./icon";
import { PageHeader } from "../page-header";
import * as colors from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { HabitDescription } from "./description";
import { HabitBreakDialog } from "./break-dialog";
import { Button } from "../ui/button";
import { History, Trash2 } from "lucide-react";
import { GitHubIcon } from "../github-icon";
import { useSelectedRepo } from "@/lib/git";
import { HabitChart } from "./chart";
import { HabitDoneButton } from "./done-button";

export const HabitView: React.FC = () => {
  const [repo] = useSelectedRepo();

  const habit = useHabitContext();
  const color = colors.forHabit(habit);

  const githubURL = `https://github.com/${repo?.full_name}/commits/main/habits/${habit.name}.json`;

  return (
    <div data-testid={`habit-view--${habit.name}`}>
      <PageHeader
        title={
          <div className={cn("flex items-center gap-2", color.text)}>
            <HabitIcon size={18} />
            {habit.name}
          </div>
        }
      />

      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <HabitDoneButton variant="outline" />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-zinc-600">Description</Label>
          <HabitDescription />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-zinc-600">Daily target</Label>
          {habit.dailyTarget}
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-zinc-600">Chart</Label>
          <HabitChart />
        </div>

        <div className="flex flex-col items-center gap-2">
          <a href={githubURL} target="_blank">
            <Button variant="ghost">
              <History />
              History
            </Button>
          </a>

          <HabitBreakDialog>
            <Button variant="ghost">
              <Trash2 />
              Break
            </Button>
          </HabitBreakDialog>
        </div>
      </div>
    </div>
  );
};
