import type { ReactNode } from "react";
import classnames from "classnames";
import type { TCTAVariant, TCTABackground } from "../../types";
import { Container } from "../layout/Container";

interface CTAProps {
  variant?: TCTAVariant;
  background?: TCTABackground;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

const bgMap: Record<TCTABackground, string> = {
  neo: "bg-neo-500 text-white",
  charcoal: "bg-charcoal text-white",
  gradient: "bg-gradient-to-r from-neo-600 to-neo-500 text-white",
};

export function CTA({
  variant = "centered",
  background = "neo",
  title,
  subtitle,
  children,
  className,
}: CTAProps) {
  const isSplit = variant === "split";

  return (
    <section
      data-component-name="CTA"
      className={classnames("py-16 md:py-20", bgMap[background], className)}
    >
      <Container>
        <div
          className={classnames(
            isSplit
              ? "flex flex-col items-center justify-between gap-6 md:flex-row"
              : "mx-auto max-w-2xl text-center"
          )}
        >
          <div className={isSplit ? "flex-1" : ""}>
            <h2
              className={classnames(
                "text-2xl font-bold tracking-tight md:text-3xl",
                background === "neo" ? "text-white" : "text-white"
              )}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className={classnames(
                  "mt-3 leading-relaxed",
                  background === "neo" ? "text-neo-100" : "text-gray-300"
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={classnames(
              "flex flex-wrap gap-3",
              !isSplit && "mt-8 justify-center"
            )}
          >
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
