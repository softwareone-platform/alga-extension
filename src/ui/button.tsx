import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "white";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background relative h-10 py-2 px-4 group cursor-pointer",
          {
            "bg-[rgb(var(--color-primary-500))] text-white hover:bg-[rgb(var(--color-primary-600))]":
              variant === "primary",
            "border border-[rgb(var(--color-border-400))] bg-white text-[rgb(var(--color-text-700))] hover:bg-[rgb(var(--color-primary-50))] hover:text-[rgb(var(--color-primary-700))]":
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
