import { useCallback, useId, useMemo, useRef, useState } from 'react'
import { normalizeTagKey } from '../utils/tags'
import TagChip from './TagChip'

/**
 * Controlled tag field: chips + input; Enter/comma adds; Backspace removes last when empty.
 */
function TagInput({
  id: idProp,
  label,
  value,
  onChange,
  suggestions = [],
  maxTags = 20,
  placeholder = 'Type a tag, then Enter or comma…',
  disabled = false,
  hint,
}) {
  const autoId = useId()
  const id = idProp ?? `tag-input-${autoId}`
  const listboxId = `${id}-suggestions`
  const inputRef = useRef(null)
  const [draft, setDraft] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(-1)

  const existingKeys = useMemo(
    () => new Set(value.map((t) => normalizeTagKey(t))),
    [value],
  )

  const filteredSuggestions = useMemo(() => {
    const q = draft.trim().toLowerCase()
    return suggestions
      .filter((s) => !existingKeys.has(normalizeTagKey(s)))
      .filter((s) => (q ? s.toLowerCase().includes(q) : true))
      .slice(0, 8)
  }, [suggestions, draft, existingKeys])

  const addTag = useCallback(
    (raw) => {
      const next = String(raw).trim()
      if (!next) return
      if (value.length >= maxTags) return
      const key = normalizeTagKey(next)
      if (existingKeys.has(key)) return
      onChange([...value, next])
      setDraft('')
      setHighlightIndex(-1)
    },
    [value, onChange, maxTags, existingKeys],
  )

  const removeAt = useCallback(
    (index) => {
      onChange(value.filter((_, i) => i !== index))
    },
    [value, onChange],
  )

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightIndex >= 0 && filteredSuggestions[highlightIndex]) {
        addTag(filteredSuggestions[highlightIndex])
      } else {
        addTag(draft)
      }
      return
    }
    if (e.key === ',') {
      e.preventDefault()
      addTag(draft)
      return
    }
    if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      e.preventDefault()
      removeAt(value.length - 1)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) =>
        Math.min(i + 1, filteredSuggestions.length - 1),
      )
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => Math.max(i - 1, -1))
    }
  }

  const labelClass =
    'text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

  const inputClass =
    'min-w-[120px] flex-1 border-0 bg-transparent py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500'

  return (
    <div className="grid gap-2">
      {label && (
        <label className={labelClass} htmlFor={id}>
          {label}
        </label>
      )}
      <div
        className={`flex min-h-[46px] flex-wrap items-center gap-2 rounded-xl border border-slate-200/90 bg-white/95 px-2 py-2 shadow-sm transition-all duration-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900/90 dark:focus-within:border-indigo-500 ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {value.map((tag, index) => (
          <TagChip
            key={`${normalizeTagKey(tag)}-${index}`}
            label={tag}
            removable
            onRemove={() => removeAt(index)}
            disabled={disabled}
          />
        ))}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            setHighlightIndex(-1)
          }}
          onPaste={(e) => {
            const text = e.clipboardData.getData('text')
            if (text.includes(',')) {
              e.preventDefault()
              text
                .split(',')
                .map((p) => p.trim())
                .filter(Boolean)
                .forEach((part) => addTag(part))
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          autoComplete="off"
          aria-controls={
            draft.trim() && filteredSuggestions.length > 0 ? listboxId : undefined
          }
          aria-autocomplete="list"
          className={inputClass}
        />
      </div>

      {filteredSuggestions.length > 0 && draft.trim() !== '' && (
        <ul
          id={listboxId}
          className="max-h-40 overflow-auto rounded-xl border border-slate-200/90 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-900"
        >
          {filteredSuggestions.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                className={`flex w-full px-3 py-2 text-left text-sm transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/50 ${i === highlightIndex ? 'bg-indigo-50 dark:bg-indigo-950/50' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTag(s)}
              >
                #{s}
              </button>
            </li>
          ))}
        </ul>
      )}

      {hint && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
      {value.length >= maxTags && (
        <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
          Maximum {maxTags} tags.
        </p>
      )}
    </div>
  )
}

export default TagInput
