import { forwardRef, HTMLAttributes } from "react";
import { clsx } from "clsx";
import { useNavigate } from "react-router";

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
        "border-b py-3 px-6 border-border-200 text-left text-sm text-text-700 group-hover:bg-primary-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

TableCell.displayName = "TableCell";
