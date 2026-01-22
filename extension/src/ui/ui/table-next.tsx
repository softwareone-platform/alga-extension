import { forwardRef, HTMLAttributes, useState } from "react";
import { Button } from "@/ui/ui";
import { cn } from "@/ui/utils";

export const TableContainer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
  return <div className="w-fit border border-border-200 rounded-md relative" ref={ref} {...props}>
    {children}
  </div>
});

export type PaginationProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  onPageChange: (page: number) => void;
  startPage?: number;
  pageSize?: number;
  totalItems: number;
  isLoading?: boolean;
};

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
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
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex justify-between items-center w-full py-3 px-6",
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
      </div>
    );
  }
);