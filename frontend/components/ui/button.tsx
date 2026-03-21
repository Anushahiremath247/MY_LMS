"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "button-ripple inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white shadow-glass hover:-translate-y-0.5",
        secondary: "bg-white text-ink shadow-soft hover:-translate-y-0.5",
        ghost: "bg-transparent text-ink hover:bg-white/70"
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

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: cn(classes, (children.props as { className?: string }).className),
        onMouseMove: (event: React.MouseEvent<HTMLElement>) => {
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
          event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
        }
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
          event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
          onMouseMove?.(event);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
