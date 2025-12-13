import React from "react";
import { useHabitContext } from "@/components/habit/context";
import { HabitIcon } from "./icon";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { HabitDescription } from "./description";
import { HabitBreakDialog } from "./break-dialog";
import { Button } from "@/components/ui/button";
import { Code, History, RefreshCw, Trash2 } from "lucide-react";
import { useSelectedRepo } from "@/lib/git";
import { HabitChart } from "./chart";
import { CompletionButtons } from "./buttons";
import { HabitProgress } from "./progress";
import { CompletionButton } from "./button";
import { create } from "@bufbuild/protobuf";
import { Completion_ButtonOptionsSchema } from "@/proto/models/v1/models_pb";
import { ButtonForm } from "./button-form";

export const HabitView: React.FC = () => {
  const [repo] = useSelectedRepo();

  const { habit, color, completion, refetch, isFetching } = useHabitContext();

  const historyURL = `https://github.com/${repo?.full_name}/commits/main/habits/${habit.name}.json`;
  const fileURL = `https://github.com/${repo?.full_name}/blob/main/habits/${habit.name}.json`;

  return (
    <div
      data-testid={`habit-view--${habit.name}`}
      className="truncate max-w-full"
    >
      <PageHeader
        title={
          <div className={cn("flex items-center gap-2", color.text)}>
            <HabitIcon size={18} />
            {habit.name}
          </div>
        }
      />

      <div className="flex flex-col gap-5 px-5">
        <div className="flex items-center gap-2 flex-wrap">
          <CompletionButtons variant="outline" />
          <ButtonForm />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground/50">Description</Label>
          <HabitDescription />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground/50">Progress</Label>
          <div className="flex items-center justify-between">
            <span>
              {completion.count} / {completion.target}
            </span>
            <CompletionButton
              options={create(Completion_ButtonOptionsSchema, {})}
              className="w-fit"
              size="sm"
            />
          </div>
          <HabitProgress className="rounded-full h-1.5" />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground/50">Chart</Label>
          <div className="max-w-full overflow-auto">
            <HabitChart />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={cn({ "animate-spin": isFetching })} />
            Refresh
          </Button>

          <a href={fileURL} target="_blank">
            <Button variant="ghost">
              <Code />
              File
            </Button>
          </a>

          <a href={historyURL} target="_blank">
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
