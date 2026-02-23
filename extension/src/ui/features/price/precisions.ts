export const CURRENCY_PRECISIONS: Record<string, number> = {
  usd: 2,
};

export const DEFAULT_PRECISION = 2;

export function getPrecision(currency: string | null | undefined): number {
  if (!currency) return DEFAULT_PRECISION;
  return CURRENCY_PRECISIONS[currency.toLowerCase()] ?? DEFAULT_PRECISION;
}
