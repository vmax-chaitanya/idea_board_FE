import { useMemo, useState } from 'react'
import { getTagLabel, normalizeTagKey } from '../utils/tags'

/**
 * Client-side search + optional multi-tag filter (any / all).
 * Server may pre-filter by tag query; this refines the current list.
 */
export function useIdeaFilters(ideas, options = {}) {
  const { selectedFilterTags = [], filterMatchAll = false } = options

  const [searchQuery, setSearchQuery] = useState('')

  const filteredIdeas = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return ideas.filter((idea) => {
      const ideaLabelSet = new Set(
        (idea.tags || []).map((t) => normalizeTagKey(getTagLabel(t))),
      )

      if (selectedFilterTags.length > 0) {
        const selectedKeys = selectedFilterTags.map((t) => normalizeTagKey(t))
        const tagOk = filterMatchAll
          ? selectedKeys.every((k) => ideaLabelSet.has(k))
          : selectedKeys.some((k) => ideaLabelSet.has(k))
        if (!tagOk) return false
      }

      if (normalizedSearch.length === 0) return true
      return (
        idea.title.toLowerCase().includes(normalizedSearch) ||
        idea.description.toLowerCase().includes(normalizedSearch) ||
        (idea.tags || []).some((tag) =>
          getTagLabel(tag).toLowerCase().includes(normalizedSearch),
        )
      )
    })
  }, [ideas, searchQuery, selectedFilterTags, filterMatchAll])

  return {
    searchQuery,
    setSearchQuery,
    filteredIdeas,
  }
}
