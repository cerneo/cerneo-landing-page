import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import classnames from "classnames";
import type { TRounded } from "../../types";
import { useRoundedSize } from "../../hooks";
import { themeConfig } from "../../config/theme.config";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  error?: string;
  rounded?: TRounded;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ name, error, rounded = themeConfig.defaultRounded, id, rows = 4, className, ...rest }, ref) => {
    const roundedClass = useRoundedSize(rounded);
    const generatedId = useId();
    const textareaId = id ?? name;
    const errorId = `${generatedId}-error`;

    return (
      <div data-component-name="Textarea" className="w-full">
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={classnames(
            "w-full resize-y border bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none",
            "placeholder-gray-400 dark:bg-charcoal dark:text-gray-100 dark:placeholder-gray-500",
            themeConfig.defaultTransition,
            roundedClass,
            error
              ? "border-error focus:border-error focus:ring-2 focus:ring-error/30"
              : "border-gray-300 focus:border-neo-500 focus:ring-2 focus:ring-neo-500/30 dark:border-gray-600",
            className
          )}
          {...rest}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
