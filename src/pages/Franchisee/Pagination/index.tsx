import { useState } from "react";
import Lucide from "../../../base-components/Lucide";

interface propstype {
  totalpages: number;
  onPageChange: (page: number) => void;
  page: number;
}

const CommonPagination: React.FC<any> = ({
  totalpages,
  onPageChange,
  page,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisibleButtons = 3; // Adjust this value to change the maximum number of visible buttons
    // Determine the range of visible page numbers
    let start = Math.max(1, page - Math.floor(maxVisibleButtons / 2));
    let end = Math.min(totalpages, start + maxVisibleButtons - 1);
    // Ensure that we always display maxVisibleButtons buttons if possible
    if (end - start + 1 < maxVisibleButtons) {
      start = Math.max(1, end - maxVisibleButtons + 1);
    }
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    // Add an ellipsis button if not all pages are visible
    if (start > 1) {
      pageNumbers.unshift(-1); // Use a special value to indicate an ellipsis button
    }
    if (end < totalpages) {
      pageNumbers.push(-1); // Use a special value to indicate an ellipsis button
    }
    return pageNumbers;
  };
  return (
    <div className="flex overflow-x-auto sm:justify-center">
      <div className="pagination grid grid-cols-1 md:grid-cols-2 justify-between pb-8 w-[100%] mt-1 items-center">
        {/* Responsive Width for different devices */}

        <div className="mr-auto">
          <strong className="text-primary">
            Showing {page} of {totalpages}
          </strong>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 justify-end w-full">
          {/* Space between buttons increases for larger screens */}

          <button onClick={() => onPageChange(1)} disabled={page === 1}>
            <Lucide icon="ChevronsLeft" className="w-4 h-4 sm:w-5 sm:h-5" />
            {/* Margin top increases on larger screens */}
          </button>
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
            <Lucide icon="ChevronLeft" className="w-4 h-4 sm:w-5 sm:h-5" />
            {/* Adjust icon size for smaller screens */}
          </button>

          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() =>
                pageNumber !== -1 ? onPageChange(pageNumber) : null
              }
              className={`m-1 rounded-lg text-xs sm:text-sm lg:text-base ${
                pageNumber === page ? "bg-[#777779] text-white" : ""
              }`}
              style={
                pageNumber === -1
                  ? { pointerEvents: "none", cursor: "default" }
                  : { border: "1px solid #E5E5E5", padding: "3px 8px" }
              }
            >
              {pageNumber !== -1 && pageNumber}
            </button>
          ))}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalpages}
          >
            <Lucide icon="ChevronRight" className="w-4 h-4 sm:w-5 sm:h-5" />
            {/* Adjust icon size for smaller screens */}
          </button>
          <button
            onClick={() => onPageChange(totalpages)}
            disabled={page === totalpages}
          >
            <Lucide icon="ChevronsRight" className="w-4 h-4 sm:w-5 sm:h-5" />
            {/* Margin top increases on larger screens */}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CommonPagination;
