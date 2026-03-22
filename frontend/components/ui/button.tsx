"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "button-ripple inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_18px_34px_rgba(31,99,232,0.32)] hover:-translate-y-1",
        secondary:
          "border border-white/75 bg-white/28 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_16px_30px_rgba(95,140,196,0.16)] backdrop-blur-xl hover:-translate-y-1",
        ghost: "bg-transparent text-ink hover:bg-white/35"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, onMouseMove, asChild, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant }), className);
    const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
      event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
      onMouseMove?.(event as React.MouseEvent<HTMLButtonElement>);
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        className?: string;
        onMouseMove?: (event: React.MouseEvent<HTMLElement>) => void;
      }>;

      return React.cloneElement(child, {
        ...(props as Record<string, unknown>),
        className: cn(classes, child.props.className),
        onMouseMove: (event: React.MouseEvent<HTMLElement>) => {
          handleMouseMove(event);
          child.props.onMouseMove?.(event);
        }
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
