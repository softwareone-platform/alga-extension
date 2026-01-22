import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@utils/cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          className,
          "bg-white rounded-2xl p-6 gap-6 border border-gray-200 w-full"
        )}
        {...props}
      />
    );
  }
);
