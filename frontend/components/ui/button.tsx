"use client";

import * as React from "react";
import { m } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader } from "./loader";

const buttonVariants = cva(
  "button-ripple pressable inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-[transform,box-shadow,background-color,color,border-color] duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:active:scale-100",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_14px_28px_rgba(37,99,235,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_18px_34px_rgba(37,99,235,0.24)] active:bg-blue-700",
        secondary:
          "border border-slate-200 bg-white text-ink shadow-[0_10px_24px_rgba(15,23,42,0.07)] hover:shadow-[0_14px_28px_rgba(15,23,42,0.1)] active:bg-slate-50",
        ghost: "bg-transparent text-ink hover:bg-white/60"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

export interface ButtonProps
  extends NativeButtonProps,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild, children, loading = false, loadingLabel, disabled, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant }), className);
    const content = loading ? (
      <Loader label={loadingLabel} tone={variant === "primary" ? "light" : "default"} />
    ) : (
      children
    );
    const isDisabled = disabled || loading;

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        className?: string;
        "aria-disabled"?: boolean;
      }>;

      return React.cloneElement(child, {
        ...(props as Record<string, unknown>),
        className: cn(classes, child.props.className),
        "aria-disabled": isDisabled
      });
    }

    return (
      <m.button
        ref={ref}
        className={classes}
        whileHover={isDisabled ? undefined : { scale: 1.015, y: -1 }}
        whileTap={isDisabled ? undefined : { scale: 0.95, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        disabled={isDisabled}
        {...props}
      >
        {content}
      </m.button>
    );
  }
);

Button.displayName = "Button";
