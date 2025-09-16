import { TableCell } from "@ui/table";

export const calculateRPxY = (
  SPxY: number | null | undefined,
  markup: number | null | undefined
) => {
  if (SPxY === undefined || SPxY === null) return "—";
  if (markup === undefined || markup === null) return "—";

  const val = SPxY * (1 + markup / 100);
  return (Math.round(val * 100) / 100).toFixed(2);
};

export const RPxYCell = ({
  SPxY,
  markup,
}: {
  SPxY: number | null | undefined;
  markup: number | null | undefined;
}) => {
  return <TableCell>{calculateRPxY(SPxY, markup)}</TableCell>;
};
