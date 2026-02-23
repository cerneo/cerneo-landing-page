import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import classnames from "classnames";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-component-name="Container"
      className={classnames("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...rest}
    >
      {children}
    </div>
  )
);

Container.displayName = "Container";
