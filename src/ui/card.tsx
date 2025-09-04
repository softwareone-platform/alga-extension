import { forwardRef, HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ ...props }, ref) => {
    return (
      <section
        ref={ref}
        className="w-full bg-white rounded-2xl p-6 flex flex-col gap-6 border border-gray-200"
        {...props}
      />
    );
  }
);
