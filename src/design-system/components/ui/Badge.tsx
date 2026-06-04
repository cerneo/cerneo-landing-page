import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import classnames from "classnames";
import type { TColor, TBadgeVariant, TRounded } from "../../types";
import { useRoundedSize } from "../../hooks";
import { themeConfig } from "../../config/theme.config";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TBadgeVariant;
  color?: TColor;
  rounded?: TRounded;
  dot?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantColorMap: Record<TBadgeVariant, Record<TColor, string>> = {
  solid: {
    neo: "bg-neo-500 text-white",
    charcoal: "bg-charcoal text-white",
    steel: "bg-steel text-white",
    white: "bg-white text-charcoal",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    error: "bg-error text-white",
    info: "bg-info text-white",
  },
  outline: {
    neo: "border border-neo-500 text-neo-600 dark:text-neo-400",
    charcoal: "border border-charcoal text-charcoal dark:border-gray-600 dark:text-gray-100",
    steel: "border border-steel text-steel dark:border-gray-600 dark:text-gray-400",
    white: "border border-white text-white",
    success: "border border-success text-success",
    warning: "border border-warning text-warning",
    error: "border border-error text-error",
    info: "border border-info text-info",
  },
  soft: {
    neo: "bg-neo-50 text-neo-700 dark:bg-neo-950 dark:text-neo-400",
    charcoal: "bg-gray-100 text-charcoal dark:bg-gray-800 dark:text-gray-100",
    steel: "bg-gray-100 text-steel dark:bg-gray-800 dark:text-gray-400",
    white: "bg-white/20 text-white",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    error: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    info: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  },
  default: {
    neo: "bg-neo-100 text-neo-800 dark:bg-neo-900 dark:text-neo-300",
    charcoal: "bg-gray-200 text-charcoal dark:bg-gray-700 dark:text-gray-100",
    steel: "bg-gray-200 text-steel dark:bg-gray-700 dark:text-gray-400",
    white: "bg-white text-charcoal dark:bg-white/20 dark:text-white",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    info: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300",
  },
};

const dotColorMap: Record<TColor, string> = {
  neo: "bg-neo-500",
  charcoal: "bg-charcoal",
  steel: "bg-steel",
  white: "bg-white",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      color = themeConfig.defaultColor,
      rounded = "full",
      dot = false,
      icon,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const roundedClass = useRoundedSize(rounded);

    return (
      <span
        ref={ref}
        data-component-name="Badge"
        className={classnames(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium",
          variantColorMap[variant][color],
          roundedClass,
          className
        )}
        {...rest}
      >
        {dot && (
          <span
            className={classnames("h-1.5 w-1.5 rounded-full", dotColorMap[color])}
          />
        )}
        {icon && icon}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
