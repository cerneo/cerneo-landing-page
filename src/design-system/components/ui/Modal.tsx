"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import classnames from "classnames";
import type { TModalSize, TRounded } from "../../types";
import { useRoundedSize } from "../../hooks";
import { themeConfig } from "../../config/theme.config";

interface ModalContextValue {
  onClose: () => void;
  titleId: string;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext(component: string): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used within <Modal>`);
  }
  return ctx;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: TModalSize;
  rounded?: TRounded;
  isStaticBackdrop?: boolean;
  children: ReactNode;
  className?: string;
}

const sizeMap: Record<TModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      size = "md",
      rounded = themeConfig.defaultRounded,
      isStaticBackdrop = false,
      children,
      className,
    },
    ref
  ) => {
    const roundedClass = useRoundedSize(rounded);
    const titleId = useId();
    const [mounted, setMounted] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => setMounted(true), []);

    // Escape closes
    useEffect(() => {
      if (!isOpen) return;
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") onClose();
      }
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Scroll lock with scrollbar compensation (avoids layout shift on the sticky Navbar)
    useEffect(() => {
      if (!isOpen) return;
      const { overflow, paddingRight } = document.body.style;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      return () => {
        document.body.style.overflow = overflow;
        document.body.style.paddingRight = paddingRight;
      };
    }, [isOpen]);

    // Move focus into the panel on open, restore it on close
    useEffect(() => {
      if (isOpen) {
        previousFocusRef.current = document.activeElement as HTMLElement | null;
        panelRef.current?.focus();
      } else {
        previousFocusRef.current?.focus();
        previousFocusRef.current = null;
      }
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <ModalContext.Provider value={{ onClose, titleId }}>
            <motion.div
              data-component-name="Modal/Backdrop"
              className="fixed inset-0 z-[60] bg-charcoal/40 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <div
              data-component-name="Modal"
              className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget && !isStaticBackdrop) onClose();
              }}
            >
              <motion.div
                ref={(node) => {
                  panelRef.current = node;
                  if (typeof ref === "function") ref(node);
                  else if (ref) ref.current = node;
                }}
                data-component-name="Modal/Panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                initial={{ opacity: 0, y: -24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.97 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={classnames(
                  "w-full border border-gray-200 bg-white shadow-2xl outline-none",
                  "dark:border-gray-700 dark:bg-slate-dark",
                  sizeMap[size],
                  roundedClass,
                  className
                )}
              >
                {children}
              </motion.div>
            </div>
          </ModalContext.Provider>
        )}
      </AnimatePresence>,
      document.body
    );
  }
);

Modal.displayName = "Modal";

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hasCloseButton?: boolean;
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, hasCloseButton = true, className, ...rest }, ref) => {
    const { onClose, titleId } = useModalContext("ModalHeader");

    return (
      <div
        ref={ref}
        data-component-name="Modal/ModalHeader"
        className={classnames("flex items-start justify-between gap-4 px-6 pt-6", className)}
        {...rest}
      >
        <h2 id={titleId} className="text-lg font-semibold text-charcoal dark:text-gray-100">
          {children}
        </h2>
        {hasCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={classnames(
              "-m-2 cursor-pointer rounded-lg p-2",
              "text-steel hover:bg-gray-100 hover:text-charcoal",
              "dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-100",
              themeConfig.defaultTransition
            )}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = "ModalHeader";

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-component-name="Modal/ModalBody"
      className={classnames("px-6 py-6", className)}
      {...rest}
    >
      {children}
    </div>
  )
);

ModalBody.displayName = "ModalBody";

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-component-name="Modal/ModalFooter"
      className={classnames("flex items-center justify-end gap-3 px-6 pb-6", className)}
      {...rest}
    >
      {children}
    </div>
  )
);

ModalFooter.displayName = "ModalFooter";
