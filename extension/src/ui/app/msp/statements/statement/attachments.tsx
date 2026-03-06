import { useState } from "react";
import { Card } from "@alga-psa/ui-kit";
import { useParams } from "react-router";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination, TableContainer } from "@/ui/ui/table";
import { Loader } from "@/ui/ui/loader";
import { useStatementAttachments } from "@features/statements";
import { formatDateTime } from "@features/dates";
import { backendClient } from "@/ui/lib/alga";

interface Attachment {
  id?: string;
  name?: string;
  description?: string;
  filename?: string;
  size?: number | null;
  audit?: {
    created?: { at?: string };
    updated?: { at?: string };
  };
}

const formatSize = (bytes?: number | null) => {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const columns: ColumnDef<Attachment>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => <span className="truncate block">{original.name || "—"}</span>
  },
  {
    accessorKey: 'description',
    header: 'Description',
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => <span className="truncate block">{original.description || "—"}</span>
  },
  {
    accessorKey: 'created',
    header: 'Created',
    minSize: 140,
    size: 160,
    cell: ({ row: { original } }) => (
      <span className="truncate block">{formatDateTime(original.audit?.created?.at) || "—"}</span>
    )
  },
  {
    accessorKey: 'updated',
    header: 'Updated',
    minSize: 140,
    size: 160,
    cell: ({ row: { original } }) => (
      <span className="truncate block">{formatDateTime(original.audit?.updated?.at) || "—"}</span>
    )
  },
  {
    accessorKey: 'file',
    header: 'File',
    minSize: 160,
    size: 192,
    cell: ({ row: { original } }) => (
      <div className="flex flex-col gap-0.5 items-start relative w-full">
        <span className="block truncate w-full">{original.filename || "—"}</span>
        <span className="block text-xs text-text-500 truncate w-full">
          {formatSize(original.size)}
        </span>
      </div>
    )
  },
];

export function Attachments() {
  const { id } = useParams<{ id: string }>();
  const [offset, setOffset] = useState(0);
  const { attachments, pagination, isFetching, isPending } =
    useStatementAttachments(id!, { offset });
  const [columnSizing, setColumnSizing] = useState({});

  const table = useReactTable({
    data: attachments as Attachment[],
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    state: { columnSizing },
  });

  if (!isPending && attachments.length === 0) return <>No Attachments found.</>;

  return (
    <Card>
      <TableContainer>
        <div className="w-full overflow-x-scroll relative">
          <table style={{ width: table.getTotalSize(), minWidth: '100%' }} className="relative table-fixed">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-border-200 border-b">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{ width: header.getSize() }} className="relative py-3 px-6 text-left text-xs font-medium tracking-wider">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                        style={{ background: header.column.getIsResizing() ? '#2563eb' : 'transparent' }}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  onClick={async () => {
                    const response = await backendClient.get<string>(`/swo/billing/statements/${id}/attachments/${row.original.id}`);
                    console.log(response);
                  }}
                  className="border-border-200 border-b text-sm text-text-700 cursor-pointer hover:bg-primary-50"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{ width: cell.column.getSize() }} className="py-3 px-6 items-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isPending && (
          <div className="flex items-center justify-center py-3 px-6 border-b border-border-200">
            <Loader />
          </div>
        )}
        <Pagination
          onPageChange={(page) =>
            setOffset((page - 1) * (pagination.limit ?? 0))
          }
          totalItems={pagination.total ?? 0}
          isLoading={isFetching}
        />
      </TableContainer>
    </Card>
  );
}
