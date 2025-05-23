import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";
import Button from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(0);

    // Current page neighborhood
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages - 2, currentPage + 1);
      i++
    ) {
      pageNumbers.push(i);
    }

    // Always show last page if we have more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages - 1);
    }

    // Sort and remove duplicates
    return [...new Set(pageNumbers)].sort((a, b) => a - b);
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={cn("flex items-center justify-center space-x-2", className)}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pageNumbers.map((page, index) => {
        // Add ellipsis
        const prevPage = pageNumbers[index - 1];
        if (prevPage !== undefined && page - prevPage > 1) {
          return (
            <React.Fragment key={`ellipsis-${page}`}>
              <span className="px-2 text-gray-500">...</span>
              <Button
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="min-w-[2.5rem]"
              >
                {page + 1}
              </Button>
            </React.Fragment>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "primary" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="min-w-[2.5rem]"
          >
            {page + 1}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;
