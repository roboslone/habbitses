import {
  Apple,
  CircleQuestionMark,
  Dumbbell,
  Hammer,
  MoonStar,
  Pill,
  Star,
  Tablets,
  Trophy,
  Wallet,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import React from "react";

export const icons: Record<string, LucideIcon> = {
  CircleQuestionMark,
  Apple,
  Wallet,
  Hammer,
  Star,
  MoonStar,
  Trophy,
  Dumbbell,
  Pill,
  Tablets,
};

export type Key = keyof typeof icons;

export const all: Key[] = Object.keys(icons);

export const fromString = (s?: string | Key): Key => {
  if (s === undefined || icons[s] === undefined) return "CircleQuestionMark";
  return s;
};

export const render = (
  key?: string | Key,
  props?: LucideProps
): React.ReactNode => React.createElement(icons[fromString(key)], props);
