import { useMemo } from "react";
import { TableCell } from "@ui/table";
import { TermsEntity } from "@swo/mp-api-model";

export const PeriodCell = ({ period }: { period: TermsEntity["period"] }) => {
  const text = useMemo(() => {
    if (period === "1m") return "Monthly";
    if (period === "1y") return "Yearly";
    if (period === "one-time") return "One-time";
    return "—";
  }, [period]);

  return <TableCell>{text}</TableCell>;
};
