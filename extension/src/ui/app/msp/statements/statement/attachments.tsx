import { Card } from "@ui/card";
import { useParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Pagination,
} from "@ui/table";
import { useState } from "react";
import { useStatementAttachments } from "@features/statements";
import { DateTimeCell } from "@features/dates";

const FileCell = ({
  filename,
  size,
}: {
  filename?: string;
  size?: number | null;
}) => {
  if (!filename) return <TableCell>—</TableCell>;

  const formatSize = (bytes?: number | null) => {
    if (bytes == null) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <TableCell className="flex flex-col gap-0.5 items-start relative w-full">
      <span className="truncate w-full">{filename}</span>
      <span className="text-xs text-text-500 truncate w-full">
        {formatSize(size)}
      </span>
    </TableCell>
  );
};

export function Attachments() {
  const { id } = useParams<{ id: string }>();
  const [offset, setOffset] = useState(0);
  const { attachments, pagination, isFetching, isPending } =
    useStatementAttachments(id!, { offset });

  if (isPending) return <></>;

  if (attachments.length === 0) return <>No Attachments found.</>;

  return (
    <Card>
      <Table className="grid-cols-[auto_auto_auto_auto_auto]">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Created</TableHeaderCell>
            <TableHeaderCell>Updated</TableHeaderCell>
            <TableHeaderCell>File</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attachments?.map((attachment) => (
            <TableRow key={attachment.id}>
              <TableCell>{attachment.name || "—"}</TableCell>
              <TableCell>{attachment.description || "—"}</TableCell>
              <DateTimeCell dateTime={attachment.audit?.created?.at} />
              <DateTimeCell dateTime={attachment.audit?.updated?.at} />
              <FileCell filename={attachment.filename} size={attachment.size} />
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <Pagination
              onPageChange={(page) =>
                setOffset((page - 1) * (pagination.limit ?? 0))
              }
              totalItems={pagination.total ?? 0}
              isLoading={isFetching}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
}
