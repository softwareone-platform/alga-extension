import { TableCell } from "@ui/table";
import { useMemo } from "react";
import dayjs from "dayjs";

export const DateTimeCell = ({
  dateTime,
}: {
  dateTime: string | null | undefined;
}) => {
  if (!dateTime) return <TableCell>—</TableCell>;

  const date = useMemo(() => {
    return dayjs(dateTime).format("MM/DD/YYYY");
  }, [dateTime]);

  const time = useMemo(() => {
    return dayjs(dateTime).format("HH:mm");
  }, [dateTime]);

  return (
    <TableCell className="flex flex-col gap-0.5 justify-center items-start">
      <span>{date}</span>
      <span className="text-xs text-text-500">{time}</span>
    </TableCell>
  );
};
