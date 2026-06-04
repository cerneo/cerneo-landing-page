import type { ReactNode } from "react";
import Image from "next/image";
import classnames from "classnames";
import { ExternalLink } from "lucide-react";
import { Badge } from "../ui/Badge";

interface ProductCardProps {
  name: string;
  description: string;
  icon: ReactNode;
  accentColor: string;
  logoSrc?: string;
  comingSoon?: boolean;
  comingSoonLabel?: string;
  href?: string;
  className?: string;
}

export function ProductCard({
  name,
  description,
  icon,
  accentColor,
  logoSrc,
  comingSoon = false,
  comingSoonLabel = "Em Breve",
  href,
  className,
}: ProductCardProps) {
  const card = (
    <div
      data-component-name="ProductCard"
      className={classnames(
        "group relative rounded-xl border border-gray-200 bg-white p-6",
        "dark:border-gray-700 dark:bg-slate-dark",
        "hover:shadow-lg hover:border-gray-300 dark:hover:shadow-neo-500/5 dark:hover:border-gray-600 transition-all duration-300",
        href && "cursor-pointer",
        className
      )}
    >
      {/* Accent top bar */}
      <div
        className={classnames("absolute top-0 left-6 right-6 h-0.5 rounded-b", accentColor)}
      />

      <div className="flex items-start justify-between">
        <div
          className={classnames(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            "bg-gray-50 group-hover:bg-gray-100 dark:bg-gray-800 dark:group-hover:bg-gray-700 transition-colors duration-300"
          )}
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={name}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          ) : (
            icon
          )}
        </div>
        {comingSoon && (
          <Badge variant="soft" color="neo">
            {comingSoonLabel}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <h3 className="text-lg font-semibold text-charcoal dark:text-gray-100">{name}</h3>
        {href && (
          <ExternalLink className="h-4 w-4 text-steel dark:text-gray-400 group-hover:text-neo-600 dark:group-hover:text-neo-400 transition-colors duration-300" />
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-steel dark:text-gray-400">{description}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {card}
      </a>
    );
  }

  return card;
}
