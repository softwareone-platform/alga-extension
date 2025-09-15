import { forwardRef, HTMLAttributes } from "react";
import { clsx } from "clsx";

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

export type TableHeadProps = Omit<
  HTMLAttributes<HTMLTableSectionElement>,
  "className"
>;

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  (props, ref) => {
    return <thead className="contents" ref={ref} {...props} />;
  }
);

TableHead.displayName = "TableHead";

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
>;

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (props, ref) => {
    return <tr className="contents" ref={ref} {...props} />;
  }
);

TableRow.displayName = "TableRow";

export const TableHeadCell = forwardRef<
  HTMLTableHeaderCellElement,
  HTMLAttributes<HTMLTableHeaderCellElement>
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

TableHeadCell.displayName = "TableHeadCell";

export const TableCell = forwardRef<
  HTMLTableCellElement,
  HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  return (
    <td
      className={clsx(
        "border-b py-3 px-6 border-border-200 text-left text-sm text-dupa",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

TableCell.displayName = "TableCell";
