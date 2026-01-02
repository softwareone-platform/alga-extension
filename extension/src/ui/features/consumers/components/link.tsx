import { Link } from "react-router";
import { cn } from "@/ui/utils/cn";

export const ConsumerLink = ({
  id,
  name,
  className,
}: {
  id: string;
  name: string;
  className?: string;
}) => {
  if (!id || !name) return <span className={className}>—</span>;
  return (
    <Link
      to={`/consumers/${id}`}
      className={cn("text-blue-500 hover:text-blue-600", className)}
    >
      {name}
    </Link>
  );
};
