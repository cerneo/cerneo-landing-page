import type { TRounded } from "../types";

const roundedMap: Record<TRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export function useRoundedSize(rounded: TRounded | undefined, fallback: TRounded = "lg"): string {
  return roundedMap[rounded ?? fallback];
}
