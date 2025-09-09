import { forwardRef, HTMLAttributes } from "react";
import { clsx } from "clsx";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={clsx(
          className,
          "w-full bg-white rounded-2xl p-6 gap-6 border border-gray-200"
        )}
        {...props}
      />
    );
  }
);
