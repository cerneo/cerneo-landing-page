import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react";
import classnames from "classnames";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ htmlFor, required = false, children, className, ...rest }, ref) => (
    <label
      ref={ref}
      data-component-name="Label"
      htmlFor={htmlFor}
      className={classnames(
        "mb-1.5 inline-block text-sm font-medium text-charcoal dark:text-gray-100",
        className
      )}
      {...rest}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-error">
          *
        </span>
      )}
    </label>
  )
);

Label.displayName = "Label";
