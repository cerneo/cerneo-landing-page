import type { TColor, TRounded } from "../types";

export interface ThemeConfig {
  defaultColor: TColor;
  defaultRounded: TRounded;
  defaultTransition: string;
}

export const themeConfig: ThemeConfig = {
  defaultColor: "neo",
  defaultRounded: "lg",
  defaultTransition: "transition-all duration-300 ease-in-out",
};
