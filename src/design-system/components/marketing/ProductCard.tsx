import type { ReactNode } from "react";
import Image from "next/image";
import classnames from "classnames";
import { Badge } from "../ui/Badge";

interface ProductCardProps {
  name: string;
  description: string;
  icon: ReactNode;
  accentColor: string;
  logoSrc?: string;
  comingSoon?: boolean;
  comingSoonLabel?: string;
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
  className,
}: ProductCardProps) {
  return (
    <div
      data-component-name="ProductCard"
      className={classnames(
        "group relative rounded-xl border border-gray-200 bg-white p-6",
        "hover:shadow-lg hover:border-gray-300 transition-all duration-300",
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
            "bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300"
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

      <h3 className="mt-4 text-lg font-semibold text-charcoal">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-steel">{description}</p>
    </div>
  );
}
