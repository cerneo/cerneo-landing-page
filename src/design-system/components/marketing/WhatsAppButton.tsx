import { forwardRef, type AnchorHTMLAttributes } from "react";
import classnames from "classnames";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import { themeConfig } from "../../config/theme.config";

interface WhatsAppButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  phone?: string;
  label: string;
  sublabel?: string;
}

export const WhatsAppButton = forwardRef<HTMLAnchorElement, WhatsAppButtonProps>(
  ({ phone = "5511952134621", label, sublabel, className, ...rest }, ref) => (
    <a
      ref={ref}
      data-component-name="WhatsAppButton"
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className={classnames("group", className)}
      {...rest}
    >
      <span className="flex h-28 items-center justify-center">
        <span className="relative inline-flex">
          <span className="absolute inline-flex h-full w-full animate-whatsapp-ping rounded-full bg-whatsapp opacity-60 motion-reduce:hidden" />
          <span
            className={classnames(
              "relative inline-flex h-14 w-14 items-center justify-center rounded-full",
              "bg-whatsapp text-white shadow-lg",
              "group-hover:scale-110 group-hover:bg-whatsapp-dark",
              themeConfig.defaultTransition
            )}
          >
            <WhatsAppIcon className="h-7 w-7" />
          </span>
        </span>
      </span>
      <span className="mt-2 block text-lg font-semibold text-charcoal dark:text-gray-100">
        {label}
      </span>
      {sublabel && (
        <span className="mt-1 block text-sm leading-relaxed text-steel dark:text-gray-400">
          {sublabel}
        </span>
      )}
    </a>
  )
);

WhatsAppButton.displayName = "WhatsAppButton";
