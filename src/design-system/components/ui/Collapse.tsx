"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface CollapseProps {
  isOpen: boolean;
  children: ReactNode;
}

export function Collapse({ isOpen, children }: CollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          data-component-name="Collapse"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
