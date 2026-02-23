import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import classnames from "classnames";
import type { TRounded } from "../../types";
import { useRoundedSize } from "../../hooks";
import { themeConfig } from "../../config/theme.config";

/* ---------- Card ---------- */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: TRounded;
  bordered?: boolean;
  shadow?: boolean;
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      rounded = themeConfig.defaultRounded,
      bordered = true,
      shadow = true,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const roundedClass = useRoundedSize(rounded);

    return (
      <div
        ref={ref}
        data-component-name="Card"
        className={classnames(
          "bg-white overflow-hidden",
          roundedClass,
          {
            "border border-gray-200": bordered,
            "shadow-sm hover:shadow-md transition-shadow duration-300": shadow,
          },
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/* ---------- CardHeader ---------- */
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-component-name="CardHeader"
      className={classnames("px-6 py-4 border-b border-gray-100", className)}
      {...rest}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

/* ---------- CardTitle ---------- */
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, ...rest }, ref) => (
    <h3
      ref={ref}
      data-component-name="CardTitle"
      className={classnames("text-lg font-semibold text-charcoal", className)}
      {...rest}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = "CardTitle";

/* ---------- CardBody ---------- */
interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-component-name="CardBody"
      className={classnames("px-6 py-4", className)}
      {...rest}
    >
      {children}
    </div>
  )
);

CardBody.displayName = "CardBody";

/* ---------- CardFooter ---------- */
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-component-name="CardFooter"
      className={classnames(
        "px-6 py-4 border-t border-gray-100 bg-mist/50",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = "CardFooter";
