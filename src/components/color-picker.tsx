import { index, all, type Key } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type React from "react";

interface P {
  active?: string | Key;
  onPick: (v: Key) => void;
  disabled?: boolean;
}

export const ColorPicker: React.FC<P> = ({ active, onPick, disabled }) => (
  <div data-testid="color-picker" className="flex flex-wrap gap-2">
    {all.map((v) => (
      <div
        key={v}
        className={cn(
          "rounded-md w-8 h-8 flex flex-col items-center justify-center cursor-pointer",
          index[v].background,
          { "opacity-80": disabled }
        )}
        onClick={() => {
          if (!disabled) onPick(v);
        }}
      >
        {active === v && <Check className="text-background" />}
      </div>
    ))}
  </div>
);

export default ColorPicker;
