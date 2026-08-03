import { forwardRef, type HTMLAttributes } from "react";
import classnames from "classnames";

type AnimatedEnvelopeProps = HTMLAttributes<HTMLDivElement>;

/**
 * Decorative envelope that opens on hover. The animation is driven by the
 * nearest ancestor carrying the Tailwind `group` class (see globals.css).
 */
export const AnimatedEnvelope = forwardRef<HTMLDivElement, AnimatedEnvelopeProps>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      data-component-name="AnimatedEnvelope"
      aria-hidden="true"
      className={classnames("env-scene", className)}
      {...rest}
    >
      <div className="env-mail">
        <div className="env-back-fold" />
        <div className="env-letter">
          <div className="env-letter-border" />
          <div className="env-letter-title" />
          <div className="env-letter-context" />
          <div className="env-letter-stamp" />
        </div>
        <div className="env-top-fold" />
        <div className="env-body" />
        <div className="env-left-fold" />
      </div>
      <div className="env-shadow" />
    </div>
  )
);

AnimatedEnvelope.displayName = "AnimatedEnvelope";
