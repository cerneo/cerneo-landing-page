import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import classnames from "classnames";
import type { TColor, TButtonVariant, TRounded } from "../../types";
import { useRoundedSize } from "../../hooks";
import { themeConfig } from "../../config/theme.config";

type TButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TButtonVariant;
  color?: TColor;
  size?: TButtonSize;
  rounded?: TRounded;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

const variantColorMap: Record<TButtonVariant, Record<TColor, string>> = {
  solid: {
    neo: "bg-neo-500 text-white hover:bg-neo-600 active:bg-neo-700",
    charcoal: "bg-charcoal text-white hover:bg-slate-dark active:bg-steel",
    steel: "bg-steel text-white hover:bg-slate-dark active:bg-charcoal",
    white: "bg-white text-charcoal hover:bg-mist active:bg-gray-200",
    success: "bg-success text-white hover:bg-emerald-600 active:bg-emerald-700",
    warning: "bg-warning text-white hover:bg-amber-600 active:bg-amber-700",
    error: "bg-error text-white hover:bg-red-600 active:bg-red-700",
    info: "bg-info text-white hover:bg-sky-600 active:bg-sky-700",
  },
  outline: {
    neo: "border-2 border-neo-500 text-neo-600 hover:bg-neo-50 active:bg-neo-100",
    charcoal: "border-2 border-charcoal text-charcoal hover:bg-gray-50 active:bg-gray-100",
    steel: "border-2 border-steel text-steel hover:bg-gray-50 active:bg-gray-100",
    white: "border-2 border-white text-white hover:bg-white/10 active:bg-white/20",
    success: "border-2 border-success text-success hover:bg-emerald-50 active:bg-emerald-100",
    warning: "border-2 border-warning text-warning hover:bg-amber-50 active:bg-amber-100",
    error: "border-2 border-error text-error hover:bg-red-50 active:bg-red-100",
    info: "border-2 border-info text-info hover:bg-sky-50 active:bg-sky-100",
  },
  ghost: {
    neo: "text-neo-600 hover:bg-neo-50 active:bg-neo-100",
    charcoal: "text-charcoal hover:bg-gray-100 active:bg-gray-200",
    steel: "text-steel hover:bg-gray-100 active:bg-gray-200",
    white: "text-white hover:bg-white/10 active:bg-white/20",
    success: "text-success hover:bg-emerald-50 active:bg-emerald-100",
    warning: "text-warning hover:bg-amber-50 active:bg-amber-100",
    error: "text-error hover:bg-red-50 active:bg-red-100",
    info: "text-info hover:bg-sky-50 active:bg-sky-100",
  },
  soft: {
    neo: "bg-neo-50 text-neo-700 hover:bg-neo-100 active:bg-neo-200",
    charcoal: "bg-gray-100 text-charcoal hover:bg-gray-200 active:bg-gray-300",
    steel: "bg-gray-100 text-steel hover:bg-gray-200 active:bg-gray-300",
    white: "bg-white/10 text-white hover:bg-white/20 active:bg-white/30",
    success: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200",
    warning: "bg-amber-50 text-amber-700 hover:bg-amber-100 active:bg-amber-200",
    error: "bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200",
    info: "bg-sky-50 text-sky-700 hover:bg-sky-100 active:bg-sky-200",
  },
  link: {
    neo: "text-neo-600 hover:text-neo-700 hover:underline",
    charcoal: "text-charcoal hover:text-slate-dark hover:underline",
    steel: "text-steel hover:text-slate-dark hover:underline",
    white: "text-white hover:text-gray-200 hover:underline",
    success: "text-success hover:text-emerald-700 hover:underline",
    warning: "text-warning hover:text-amber-700 hover:underline",
    error: "text-error hover:text-red-700 hover:underline",
    info: "text-info hover:text-sky-700 hover:underline",
  },
};

const sizeMap: Record<TButtonSize, string> = {
  xs: "px-2.5 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
  xl: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      color = themeConfig.defaultColor,
      size = "md",
      rounded = themeConfig.defaultRounded,
      icon,
      iconPosition = "left",
      isLoading = false,
      fullWidth = false,
      children,
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const roundedClass = useRoundedSize(rounded);

    return (
      <button
        ref={ref}
        data-component-name="Button"
        disabled={disabled || isLoading}
        className={classnames(
          "inline-flex items-center justify-center gap-2 font-medium",
          themeConfig.defaultTransition,
          variantColorMap[variant][color],
          sizeMap[size],
          roundedClass,
          {
            "w-full": fullWidth,
            "cursor-not-allowed opacity-50": disabled || isLoading,
            "cursor-pointer": !disabled && !isLoading,
          },
          className
        )}
        {...rest}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {icon && iconPosition === "left" && !isLoading && icon}
        {children}
        {icon && iconPosition === "right" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";
