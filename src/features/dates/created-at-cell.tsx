import { TableCell } from "@ui/table";
import { useMemo } from "react";
import dayjs from "dayjs";

export const CreatedCell = ({
  createdAt,
}: {
  createdAt: string | null | undefined;
}) => {
  if (!createdAt) return <TableCell>—</TableCell>;

  const date = useMemo(() => {
    return dayjs(createdAt).format("MM/DD/YYYY");
  }, [createdAt]);

  const time = useMemo(() => {
    return dayjs(createdAt).format("HH:mm");
  }, [createdAt]);

  return (
    <TableCell className="flex flex-col gap-0.5 justify-center items-start">
      <span>{date}</span>
      <span className="text-xs text-text-500">{time}</span>
    </TableCell>
  );
};
