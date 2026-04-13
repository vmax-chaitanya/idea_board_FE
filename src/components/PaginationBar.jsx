import { ChevronLeft, ChevronRight } from 'lucide-react'

function PaginationBar({
  pagination,
  onPageChange,
  disabled,
  className = '',
}) {
  if (!pagination || pagination.total_pages <= 0) return null

  const { page, total_pages, total, limit, has_next, has_prev } = pagination
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <nav
      className={`flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-700/90 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between ${className}`}
      aria-label="Pagination"
    >
      <p className="text-center text-sm text-slate-600 dark:text-slate-400 sm:text-left">
        Showing{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {start}-{end}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {total}
        </span>
        <span className="text-slate-500 dark:text-slate-500">
          {' '}
          (page {page} of {total_pages})
        </span>
      </p>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={disabled || !has_prev}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Previous
        </button>
        <button
          type="button"
          disabled={disabled || !has_next}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </nav>
  )
}

export default PaginationBar
