import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@utils/cn";

export type TabsProps = HTMLAttributes<HTMLElement>;

const TabsComponent = forwardRef<HTMLElement, TabsProps>(
  ({ className, ...props }, ref) => {
    return (
      <nav
        aria-orientation="horizontal"
        data-orientation="horizontal"
        ref={ref}
        className={cn("flex items-center border-b border-gray-200", className)}
        {...props}
      />
    );
  }
);

export type TabProps = HTMLAttributes<HTMLSpanElement> & {
  isActive?: boolean;
};

const TabComponent = forwardRef<HTMLSpanElement, TabProps>(
  ({ isActive = false, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "px-4 py-2 block border-b-2",
          {
            "border-transparent": !isActive,
            "border-blue-500 text-blue-500": isActive,
          },
          className
        )}
        {...props}
      />
    );
  }
);

export const Tabs = TabsComponent as typeof TabsComponent & {
  Tab: typeof TabComponent;
};

// Compound component pattern
Tabs.Tab = TabComponent;
