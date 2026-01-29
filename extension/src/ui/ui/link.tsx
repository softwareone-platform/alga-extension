import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router";
import { cn } from "@/ui/utils/cn";

export type LinkProps = Omit<RouterLinkProps, "to"> & { to?: RouterLinkProps["to"] };

export const Link = ({
  to,
  children,
  className,
  ...props
}: LinkProps) => {
  if (!to) return <span className={className}>—</span>;
  return (
    <RouterLink
      to={to}
      className={cn("text-blue-500 hover:text-blue-600", className)}
      {...props}
    >
      {children}
    </RouterLink>
  );
};
