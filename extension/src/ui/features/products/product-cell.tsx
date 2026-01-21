import { TableCell } from "@ui/table";
import { Icon } from "@ui/icon";

export const ProductCell = ({
  name,
  iconUrl,
}: {
  name?: string | null;
  iconUrl?: string | null;
}) => {
  return (
    <TableCell className="gap-4 w-full items-center">
      <Icon iconUrl={iconUrl} alt={name} className="size-8" />
      <span className="truncate">{name || "—"}</span>
    </TableCell>
  );
};

export const Product = ({ name, iconUrl }: { name?: string | null; iconUrl?: string | null }) => {
  return (
    <div className="flex gap-4 w-full items-center">
      <Icon iconUrl={iconUrl} alt={name} className="size-8" />
      <span className="truncate">{name || "—"}</span>
    </div>
  );
};