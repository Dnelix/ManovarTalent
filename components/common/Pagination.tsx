
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-white">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{startItem}</span> to <span className="font-bold text-slate-900">{endItem}</span> of <span className="font-bold text-slate-900">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft size={16} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`relative inline-flex items-center px-3 py-2 border border-slate-200 text-xs font-bold ${
                  currentPage === i + 1 
                    ? 'z-10 bg-primary border-primary text-white' 
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
