import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import classnames from "classnames";

/* ---------- Timeline ---------- */
interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-component-name="Timeline"
      className={classnames("relative space-y-8", className)}
      {...rest}
    >
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neo-200" />
      {children}
    </div>
  )
);

Timeline.displayName = "Timeline";

/* ---------- TimelineHeader ---------- */
interface TimelineHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const TimelineHeader = forwardRef<HTMLDivElement, TimelineHeaderProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-component-name="TimelineHeader"
      className={classnames("relative pl-12", className)}
      {...rest}
    >
      <div className="absolute left-2 top-1 h-5 w-5 rounded-full bg-neo-500 border-4 border-white" />
      {children}
    </div>
  )
);

TimelineHeader.displayName = "TimelineHeader";

/* ---------- TimelineItem ---------- */
interface TimelineItemProps extends HTMLAttributes<HTMLDivElement> {
  year?: string;
  title: string;
  children: ReactNode;
}

export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ year, title, children, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-component-name="TimelineItem"
      className={classnames("relative pl-12", className)}
      {...rest}
    >
      <div className="absolute left-2.5 top-1.5 h-3.5 w-3.5 rounded-full bg-neo-200 border-2 border-white" />
      {year && (
        <span className="text-sm font-medium text-neo-600">{year}</span>
      )}
      <h4 className="text-lg font-semibold text-charcoal">{title}</h4>
      <div className="mt-1 text-steel leading-relaxed">{children}</div>
    </div>
  )
);

TimelineItem.displayName = "TimelineItem";
