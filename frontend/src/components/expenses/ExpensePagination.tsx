import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ExpensePaginationProps {
  page: number;
  total: number;
  perPage?: number;
  onChange: (page: number) => void;
}

export const ExpensePagination = ({ page, total, perPage = 10, onChange }: ExpensePaginationProps) => {
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
    if (page <= 2) return i + 1;
    if (page >= totalPages - 1) return totalPages - 2 + i;
    return page - 1 + i;
  });

  return (
    <div className="p-6 border-t border-app flex items-center justify-between">
      <p className="text-xs text-muted-app font-medium">
        Showing {start}–{end} of {total} records
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-2 border border-app rounded-lg hover:bg-muted/5 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
              p === page ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'hover:bg-muted/5 border border-app'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 border border-app rounded-lg hover:bg-muted/5 disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};