import { Link } from "@ui/link";

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
    <Link href={`/consumers/${id}`} className={className}>
      {name}
    </Link>
  );
};
