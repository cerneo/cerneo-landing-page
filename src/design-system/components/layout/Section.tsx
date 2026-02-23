import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import classnames from "classnames";
import type { TSectionVariant } from "../../types";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: TSectionVariant;
  children: ReactNode;
}

const variantMap: Record<TSectionVariant, string> = {
  default: "bg-white",
  dark: "bg-charcoal text-white",
  mist: "bg-mist",
  gradient: "bg-gradient-to-br from-charcoal via-slate-dark to-charcoal text-white",
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ variant = "default", children, className, ...rest }, ref) => (
    <section
      ref={ref}
      data-component-name="Section"
      className={classnames("py-16 md:py-24", variantMap[variant], className)}
      {...rest}
    >
      {children}
    </section>
  )
);

Section.displayName = "Section";
