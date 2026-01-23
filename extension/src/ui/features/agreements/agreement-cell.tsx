export const Agreement = ({ name, id }: { name?: string | null; id?: string | null }) => {
  if (!name && !id) return <div>—</div>;
  return (
    <div className="flex flex-col gap-0.5 items-start relative w-full">
      <span className="block truncate w-full">{name || "—"}</span>
      <span className="block text-xs text-text-500 truncate w-full">{id || "—"}</span>
    </div>
  );
};