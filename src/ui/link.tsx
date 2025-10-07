import { AnchorHTMLAttributes, forwardRef } from "react";
import { cn } from "@utils/cn";

export const Link = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={cn("text-blue-500 hover:text-blue-600", className)}
      {...props}
    />
  );
});
