import dayjs from "dayjs";

export type AuditProps = {
  at?: string | null;
  by?: string | null;
};

export const Audit = ({ at, by }: AuditProps) => {
  if (!at && !by) return <span>—</span>;

  return (
    <div className="text-sm text-gray-500">
      {at && <span>{dayjs(at).format("HH:mm MM/DD/YYYY")}</span>}
      <span> </span>
      {by && <span>by {by}</span>}
    </div>
  );
};
