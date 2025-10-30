import { forwardRef } from "react";
import {
  Button as HeadlessButton,
  ButtonProps as HeadlessButtonProps,
} from "@headlessui/react";
import { cn } from "@utils/cn";

export type ButtonVariant = "primary" | "secondary" | "white";

export type ButtonProps = HeadlessButtonProps & {
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, ...props }, ref) => {
    return (
      <HeadlessButton
        ref={ref}
        className={cn(
          "flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-primary-600 disabled:pointer-events-none disabled:opacity-50 ring-offset-background relative h-10 py-2 px-4 group cursor-pointer",
          {
            "bg-primary-500 text-white hover:bg-primary-600":
              variant === "primary",
            "border border-border-400 bg-white text-text-700 hover:bg-primary-50 hover:text-primary-700":
              variant === "white",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
