import { forwardRef, HTMLAttributes } from "react";

export type ErrorCardProps = HTMLAttributes<HTMLDivElement>;

export const ErrorCard = forwardRef<HTMLDivElement, ErrorCardProps>(
  ({ children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className="w-full bg-white rounded-2xl p-2 flex flex-row gap-4 border border-gray-200"
        {...props}
      >
        <div className="w-2 h-full bg-danger-4 rounded" />
        <div>{children}</div>
      </section>
    );
  }
);
