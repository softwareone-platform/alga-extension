import { forwardRef, HTMLAttributes, useEffect, useState } from "react";
import { clsx } from "clsx";
import { useNavigate } from "react-router";
import { Button } from "./button";

export const Table = forwardRef<
  HTMLTableElement,
  HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => {
  return (
    <table
      ref={ref}
      className={clsx(
        className,
        "w-full grid border border-border-200 rounded-md"
      )}
      {...props}
    />
  );
});

Table.displayName = "Table";

export type TableSectionProps = Omit<
  HTMLAttributes<HTMLTableSectionElement>,
  "className"
>;

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableSectionProps
>((props, ref) => {
  return <thead className="contents" ref={ref} {...props} />;
});

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  TableSectionProps
>((props, ref) => {
  return <tfoot className="contents" ref={ref} {...props} />;
});

TableHeader.displayName = "TableHeader";
TableFooter.displayName = "TableFooter";

export type TableBodyProps = Omit<
  HTMLAttributes<HTMLTableSectionElement>,
  "className"
>;

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  (props, ref) => {
    return <thead className="contents" ref={ref} {...props} />;
  }
);

TableBody.displayName = "TableBody";

export type TableRowProps = Omit<
  HTMLAttributes<HTMLTableRowElement>,
  "className"
> & {
  link?: string;
};

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ link, ...props }, ref) => {
    const navigate = useNavigate();

    return (
      <tr
        className={clsx("contents group", { "cursor-pointer": !!link })}
        onClick={() => {
          if (link) {
            navigate(link);
          }
        }}
        ref={ref}
        {...props}
      />
    );
  }
);

TableRow.displayName = "TableRow";

export const TableHeaderCell = forwardRef<
  HTMLTableCellElement,
  HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  return (
    <th
      className={clsx(
        "border-b py-3 px-6 border-border-200 text-left text-xs font-medium tracking-wider",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

TableHeaderCell.displayName = "TableHeadCell";

export const TableCell = forwardRef<
  HTMLTableCellElement,
  HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  return (
    <td
      className={clsx(
        "border-b py-3 px-6 border-border-200 text-left text-sm text-text-700 group-hover:bg-primary-50 flex items-center",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

TableCell.displayName = "TableCell";

export type PaginationProps = Omit<
  HTMLAttributes<HTMLTableCellElement>,
  "children"
> & {
  onPageChange: (page: number) => void;
  startPage?: number;
  pageSize?: number;
  totalItems: number;
  isLoading?: boolean;
};

export const Pagination = forwardRef<HTMLTableCellElement, PaginationProps>(
  (
    {
      onPageChange,
      startPage,
      pageSize,
      totalItems,
      className,
      isLoading,
      ...props
    },
    ref
  ) => {
    const totalPages = Math.ceil(totalItems / (pageSize ?? 10)) || 1;
    const [page, setPage] = useState(startPage ?? 1);

    const setCurrentPage = (page: number) => {
      setPage(page);
      onPageChange(page);
    };

    return (
      <TableHeaderCell
        ref={ref}
        {...props}
        className={clsx(
          "flex justify-between col-span-full border-b-0",
          className
        )}
      >
        <Button
          variant="white"
          onClick={() => setCurrentPage(Math.max(page - 1, 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <span className="text-sm text-text-700">
          Page {page} of {totalPages} ({totalItems} total records)
        </span>
        <Button
          variant="white"
          onClick={() => setCurrentPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages || isLoading}
        >
          Next
        </Button>
      </TableHeaderCell>
    );
  }
);

Pagination.displayName = "Pagination";
