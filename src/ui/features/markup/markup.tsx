export const withMarkup = (
  price: number | null | undefined,
  markup: number | null | undefined
) => {
  if (price === undefined || price === null) return "—";
  if (markup === undefined || markup === null) return "—";

  const val = price * (1 + markup / 100);
  return (Math.round(val * 100) / 100).toFixed(2);
};