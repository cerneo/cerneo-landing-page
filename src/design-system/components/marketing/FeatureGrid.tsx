import type { ReactNode } from "react";
import classnames from "classnames";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const columnMap = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

export function FeatureGrid({
  features,
  columns = 3,
  className,
}: FeatureGridProps) {
  return (
    <div
      data-component-name="FeatureGrid"
      className={classnames(
        "grid grid-cols-1 gap-6 md:gap-8",
        columnMap[columns],
        className
      )}
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className="group rounded-xl border border-gray-100 bg-white p-6 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neo-50 text-neo-600 group-hover:bg-neo-100 transition-colors duration-300">
            {feature.icon}
          </div>
          <h3 className="mt-4 text-base font-semibold text-charcoal">
            {feature.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
