export const calculateRPxY = (SPxY: number = 0, markup: number = 0) => {
  const val = SPxY * (1 + markup / 100);
  return val ? (Math.round(val * 100) / 100).toFixed(2) : "—";
};
