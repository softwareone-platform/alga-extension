import { TableCell } from "@ui/table";

export const withMarkup = (
  price: number | null | undefined,
  markup: number | null | undefined
) => {
  if (price === undefined || price === null) return "—";
  if (markup === undefined || markup === null) return "—";

  const val = price * (1 + markup / 100);
  return (Math.round(val * 100) / 100).toFixed(2);
};

export const MarkupCell = ({
  markup,
}: {
  markup: number | null | undefined;
}) => {
  return <TableCell>{markup ? `${markup}%` : "—"}</TableCell>;
};

export const PriceWithMarkupCell = ({
  price,
  markup,
}: {
  price: number | null | undefined;
  markup: number | null | undefined;
}) => {
  return <TableCell>{withMarkup(price, markup)}</TableCell>;
};
