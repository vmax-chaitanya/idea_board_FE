import TagChip from './TagChip'

/**
 * Multi-select tag filter with optional Any / All match mode.
 */
function TagFilter({
  availableTags,
  selectedTags,
  onSelectedChange,
  matchMode,
  onMatchModeChange,
  disabled = false,
}) {
  const toggle = (tag) => {
    const key = tag.toLowerCase()
    const has = selectedTags.some((t) => t.toLowerCase() === key)
    if (has) {
      onSelectedChange(selectedTags.filter((t) => t.toLowerCase() !== key))
    } else {
      onSelectedChange([...selectedTags, tag])
    }
  }

  const clearAll = () => onSelectedChange([])

  if (availableTags.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 px-3 py-2 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-400">
        No tags yet — add ideas to filter by tag.
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Filter by tags
        </span>
        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="text-xs font-semibold text-indigo-600 underline-offset-2 transition-colors hover:underline disabled:opacity-50 dark:text-indigo-400"
          >
            Clear all
          </button>
        )}
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Tag filter"
      >
        {availableTags.map((tag) => {
          const selected = selectedTags.some(
            (t) => t.toLowerCase() === tag.toLowerCase(),
          )
          return (
            <TagChip
              key={tag}
              label={tag}
              selected={selected}
              selectable
              onClick={() => toggle(tag)}
              disabled={disabled}
            />
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Match:
        </span>
        <div className="inline-flex rounded-lg border border-slate-200/90 p-0.5 dark:border-slate-600">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onMatchModeChange('any')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
              matchMode === 'any'
                ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            Any tag
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onMatchModeChange('all')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
              matchMode === 'all'
                ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            All tags
          </button>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {matchMode === 'any'
            ? 'Show ideas with at least one selected tag (server + list).'
            : 'Show ideas that include every selected tag (this page).'}
        </span>
      </div>
    </div>
  )
}

export default TagFilter
