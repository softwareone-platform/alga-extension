import { Link } from "@ui/link";

export const ConsumerLink = ({ id, name }: { id: string; name: string }) => {
  if (!id || !name) return <span>—</span>;
  return <Link href={`/consumers/${id}`}>{name}</Link>;
};
