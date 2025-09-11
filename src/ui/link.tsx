import { AnchorHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export const Link = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={clsx("text-blue-500 hover:text-blue-600", className)}
      {...props}
    />
  );
});
