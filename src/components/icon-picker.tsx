import * as colors from "@/lib/colors";
import * as icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import React from "react";

interface P {
  active?: string | icons.Key;
  color?: colors.Key;
  onPick: (v: icons.Key) => void;
  disabled?: boolean;
}

export const IconPicker: React.FC<P> = ({
  active,
  color,
  onPick,
  disabled,
}) => (
  <div data-testid="color-picker" className="flex flex-wrap gap-2">
    {icons.all.map((v) => (
      <div
        key={v}
        className={cn(
          "rounded-md w-10 h-10 flex flex-col items-center justify-center bg-card border-2 cursor-pointer",
          colors.index[colors.fromString(color)]?.text,
          { "border-primary": active === v },
          { "opacity-80": disabled }
        )}
        onClick={() => {
          if (!disabled) onPick(v);
        }}
      >
        {icons.render(v, { size: 22 })}
      </div>
    ))}
  </div>
);

export default IconPicker;
