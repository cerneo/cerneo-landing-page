"use client";

import {
  createContext,
  useContext,
  useState,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import classnames from "classnames";
import { ChevronDown } from "lucide-react";
import { Collapse } from "./Collapse";
import { themeConfig } from "../../config/theme.config";

/* ---------- Context ---------- */
interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (id: string) => void;
  multiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("AccordionItem must be used within Accordion");
  return context;
}

/* ---------- Accordion ---------- */
interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  multiple?: boolean;
  defaultOpen?: string[];
  children: ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ multiple = false, defaultOpen = [], children, className, ...rest }, ref) => {
    const [openItems, setOpenItems] = useState<Set<string>>(
      new Set(defaultOpen)
    );

    const toggle = (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!multiple) next.clear();
          next.add(id);
        }
        return next;
      });
    };

    return (
      <AccordionContext.Provider value={{ openItems, toggle, multiple }}>
        <div
          ref={ref}
          data-component-name="Accordion"
          className={classnames("divide-y divide-gray-200", className)}
          {...rest}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = "Accordion";

/* ---------- AccordionItem ---------- */
interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  title: string;
  children: ReactNode;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ id, title, children, className, ...rest }, ref) => {
    const { openItems, toggle } = useAccordionContext();
    const isOpen = openItems.has(id);

    return (
      <div
        ref={ref}
        data-component-name="AccordionItem"
        data-active={isOpen || undefined}
        className={classnames("py-1", className)}
        {...rest}
      >
        <button
          type="button"
          onClick={() => toggle(id)}
          className={classnames(
            "flex w-full items-center justify-between py-4 text-left font-medium text-charcoal",
            themeConfig.defaultTransition,
            "hover:text-neo-600 cursor-pointer"
          )}
          aria-expanded={isOpen}
        >
          <span>{title}</span>
          <ChevronDown
            className={classnames(
              "h-5 w-5 shrink-0 text-steel",
              themeConfig.defaultTransition,
              { "rotate-180": isOpen }
            )}
          />
        </button>
        <Collapse isOpen={isOpen}>
          <div className="pb-4 text-steel leading-relaxed">{children}</div>
        </Collapse>
      </div>
    );
  }
);

AccordionItem.displayName = "AccordionItem";
