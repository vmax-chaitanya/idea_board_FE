/** Normalize for duplicate checks (trim + lowercase). */
export function normalizeTagKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

/** Human-readable label for API tag shapes: string | { id, name } */
export function getTagLabel(tag) {
  if (tag == null) return ''
  if (typeof tag === 'string') return tag.trim()
  if (typeof tag === 'object') {
    if (typeof tag.name === 'string' && tag.name.trim()) return tag.name.trim()
    if (tag.id != null) return String(tag.id)
  }
  return String(tag)
}

/**
 * Stable, unique React key for a tag in a list.
 * Prefer tag.id; else disambiguate with index + name/string (never stringify raw objects).
 */
export function getTagReactKey(tag, index, scopeId = '') {
  const scope = scopeId != null && scopeId !== '' ? `${scopeId}-` : ''

  if (tag == null) {
    return `${scope}tag-${index}`
  }

  if (typeof tag === 'string') {
    return `${scope}tag-${index}-${tag}`
  }

  if (typeof tag === 'object') {
    if (tag.id != null && String(tag.id)) {
      return `${scope}tag-${String(tag.id)}`
    }
    const label = getTagLabel(tag)
    if (label) {
      return `${scope}tag-${index}-${label}`
    }
  }

  return `${scope}tag-${index}`
}

/** Value sent to GET ?tag= (uses label / name for object tags). */
export function getTagQueryValue(tag) {
  return getTagLabel(tag)
}

export function parseTagsFromInput(tagsInput) {
  return tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function collectUniqueTags(ideas) {
  const labels = ideas.flatMap((idea) =>
    (idea.tags || []).map((t) => getTagLabel(t)),
  )
  return [...new Set(labels)].filter(Boolean).sort((a, b) => a.localeCompare(b))
}
