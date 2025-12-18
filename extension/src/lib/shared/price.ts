export const priceWithMarkup = (
  price: number | null | undefined,
  markup: number | null | undefined
) => {
  if (price === undefined || price === null) return null;
  if (markup === undefined || markup === null) return null;

  const val = price * (1 + markup / 100);
  return Number((Math.round(val * 100) / 100).toFixed(2));
};
