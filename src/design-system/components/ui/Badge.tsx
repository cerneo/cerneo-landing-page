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
    neo: "border border-neo-500 text-neo-600",
    charcoal: "border border-charcoal text-charcoal",
    steel: "border border-steel text-steel",
    white: "border border-white text-white",
    success: "border border-success text-success",
    warning: "border border-warning text-warning",
    error: "border border-error text-error",
    info: "border border-info text-info",
  },
  soft: {
    neo: "bg-neo-50 text-neo-700",
    charcoal: "bg-gray-100 text-charcoal",
    steel: "bg-gray-100 text-steel",
    white: "bg-white/20 text-white",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    error: "bg-red-50 text-red-700",
    info: "bg-sky-50 text-sky-700",
  },
  default: {
    neo: "bg-neo-100 text-neo-800",
    charcoal: "bg-gray-200 text-charcoal",
    steel: "bg-gray-200 text-steel",
    white: "bg-white text-charcoal",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
    info: "bg-sky-100 text-sky-800",
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
