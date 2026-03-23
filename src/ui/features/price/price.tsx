import { getPrecision } from "./precisions";

export function Price({
  currency,
  value,
}: {
  currency: string | null | undefined;
  value: number | null | undefined;
}) {
  if (currency === null || currency === undefined) return <span>—</span>;
  if (value === null || value === undefined) return <span>—</span>;

  const precision = getPrecision(currency);
  const formatted = value.toFixed(precision);
  return <span>{formatted}</span>;
}

export function PriceWithMarkup({
  currency,
  value,
  markup,
}: {
  currency: string | null | undefined;
  value: number | null | undefined;
  markup: number | null | undefined;
}) {
  if (currency === null || currency === undefined) return <span>—</span>;
  if (value === null || value === undefined) return <span>—</span>;
  if (markup === null || markup === undefined) return <span>—</span>;

  const computedValue = value * (1 + markup / 100);
  return <Price currency={currency} value={computedValue} />;
}
