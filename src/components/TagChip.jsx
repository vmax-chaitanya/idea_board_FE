import { X } from 'lucide-react'

const baseChip =
  'inline-flex max-w-full items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all duration-200 motion-safe:animate-[chip-enter_0.2s_ease-out]'

const defaultStyle =
  'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'

const selectedStyle =
  'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/80 hover:bg-indigo-500 dark:bg-indigo-500 dark:text-white dark:ring-indigo-400/60 dark:hover:bg-indigo-400'

/**
 * Shared chip for tag input (removable) and tag filter (selectable).
 */
function TagChip({
  label,
  selected = false,
  removable = false,
  selectable = false,
  onRemove,
  onClick,
  disabled = false,
  className = '',
}) {
  if (removable && onRemove) {
    return (
      <span
        className={`${baseChip} ${selected ? selectedStyle : defaultStyle} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
      >
        <span className="min-w-0 truncate">#{label}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (!disabled) onRemove()
          }}
          disabled={disabled}
          className="-mr-0.5 inline-flex shrink-0 rounded-full p-0.5 text-current transition-colors hover:bg-black/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-white/15"
          aria-label={`Remove tag ${label}`}
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </span>
    )
  }

  if (selectable && onClick) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-pressed={selected}
        className={`${baseChip} ${selected ? selectedStyle : defaultStyle} focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900 ${className}`}
      >
        <span className="truncate">#{label}</span>
      </button>
    )
  }

  return (
    <span
      className={`${baseChip} ${selected ? selectedStyle : defaultStyle} ${className}`}
    >
      <span className="truncate">#{label}</span>
    </span>
  )
}

export default TagChip
