import IdeaCard from '../components/IdeaCard'
import IdeaCardSkeleton from '../components/IdeaCardSkeleton'
import IdeaForm from '../components/IdeaForm'
import PaginationBar from '../components/PaginationBar'
import TagFilter from '../components/TagFilter'
import ThemeToggle from '../components/ThemeToggle'
import Toast from '../components/Toast'
import { useIdeaFilters } from '../hooks/useIdeaFilters'
import { useIdeas } from '../hooks/useIdeas'
import { useTheme } from '../hooks/useTheme'
import { getTagLabel } from '../utils/tags'
import { useEffect, useMemo, useRef, useState } from 'react'

function IdeaBoardPage() {
  const { theme, toggleTheme } = useTheme()
  const {
    ideas,
    pagination,
    loading,
    error,
    actionError,
    clearActionError,
    isSubmitting,
    isGenerating,
    submitIdea,
    likeIdeaById,
    reloadIdeas,
  } = useIdeas()

  const [selectedFilterTags, setSelectedFilterTags] = useState([])
  const [filterMatchMode, setFilterMatchMode] = useState('any')

  const { searchQuery, setSearchQuery, filteredIdeas } = useIdeaFilters(ideas, {
    selectedFilterTags,
    filterMatchAll: filterMatchMode === 'all',
  })

  const [toast, setToast] = useState({ message: '', type: 'info' })
  const prevErrorRef = useRef('')
  const tagCatalogRef = useRef(new Set())

  useEffect(() => {
    ideas.forEach((idea) => {
      ;(idea.tags || []).forEach((t) => {
        const label = getTagLabel(t)
        if (label) tagCatalogRef.current.add(label)
      })
    })
  }, [ideas])

  const availableTags = [...tagCatalogRef.current].sort((a, b) =>
    a.localeCompare(b),
  )
  const hasIdeas = ideas.length > 0

  const tagQuery = useMemo(() => {
    if (selectedFilterTags.length === 0 || filterMatchMode === 'all') {
      return undefined
    }
    return [...selectedFilterTags].sort((a, b) => a.localeCompare(b)).join(',')
  }, [selectedFilterTags, filterMatchMode])

  useEffect(() => {
    reloadIdeas({
      tag: tagQuery,
      page: 1,
    })
  }, [tagQuery, reloadIdeas])

  const handlePageChange = (nextPage) => {
    reloadIdeas({
      tag: tagQuery,
      page: nextPage,
    })
    globalThis.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!error) {
      prevErrorRef.current = ''
      return
    }
    if (error === prevErrorRef.current) return
    prevErrorRef.current = error
    setToast({ message: error, type: 'error' })
  }, [error])

  useEffect(() => {
    if (!actionError) return
    setToast({ message: actionError, type: 'error' })
  }, [actionError])

  useEffect(() => {
    if (!toast.message) return undefined
    const timer = setTimeout(() => {
      setToast({ message: '', type: 'info' })
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const handleSubmit = async (payload) => {
    clearActionError()
    const result = await submitIdea(payload)
    if (result?.success) {
      setToast({
        message: 'Idea created. AI suggestion is ready.',
        type: 'success',
      })
    }
    return result
  }

  const handleLike = async (ideaId) => {
    clearActionError()
    const result = await likeIdeaById(ideaId)
    if (result?.success) {
      setToast({ message: 'Thanks for your vote.', type: 'success' })
    } else if (result?.reason === 'already-liked' && result.message) {
      setToast({ message: result.message, type: 'info' })
    }
  }

  const filterActive =
    selectedFilterTags.length > 0 || searchQuery.trim().length > 0

  return (
    <main className="app-shell">
      <header className="app-header sticky top-0 z-50 -mx-4 mb-4 border-b border-slate-200/70 bg-[var(--bg)]/90 px-4 pb-3 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-xl backdrop-saturate-150 dark:border-slate-700/60 dark:bg-[var(--bg)]/92 sm:-mx-6 sm:px-6">
        <nav className="top-nav panel shadow-md ring-1 ring-slate-200/60 dark:ring-slate-600/50">
          <div className="brand">
            <span className="brand-dot" />
            <div>
              <h1>AI-Assisted Idea Board</h1>
              <p>Collect ideas, get AI suggestions, and vote smartly.</p>
            </div>
          </div>

          <div className="nav-actions">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search ideas..."
              className="nav-search"
              aria-label="Search ideas"
            />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </nav>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(280px,380px)_1fr] lg:items-start">
        <aside
          className="sticky z-40 self-start"
          style={{ top: 'var(--sticky-header-offset)' }}
        >
          <div
            className="overflow-y-auto overflow-x-hidden rounded-2xl border border-white/70 bg-white/85 p-4 shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/60 backdrop-blur-xl transition-shadow duration-200 dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-black/40 dark:ring-slate-600/50"
            style={{
              maxHeight:
                'calc(100vh - var(--sticky-header-offset) - env(safe-area-inset-bottom, 0px) - 1rem)',
            }}
          >
            <IdeaForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isGenerating={isGenerating}
              tagSuggestions={availableTags}
            />
          </div>
        </aside>

        <section className="min-w-0">
          <div className="panel filters">
            <TagFilter
              availableTags={availableTags}
              selectedTags={selectedFilterTags}
              onSelectedChange={setSelectedFilterTags}
              matchMode={filterMatchMode}
              onMatchModeChange={setFilterMatchMode}
              disabled={loading}
            />
          </div>

          {loading && (
            <div className="grid gap-3">
              <IdeaCardSkeleton />
              <IdeaCardSkeleton />
            </div>
          )}

          {!loading && error && (
            <div className="panel empty-state error-banner" role="alert">
              <h3>Could not load ideas</h3>
              <p>{error}</p>
              <button
                type="button"
                className="button button-secondary button-ripple"
                onClick={() =>
                  reloadIdeas({
                    tag: tagQuery,
                    page: pagination?.page ?? 1,
                  })
                }
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-3">
              {filteredIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} onLike={handleLike} />
              ))}

              {hasIdeas && filteredIdeas.length === 0 && (
                <div className="rounded-2xl border border-slate-200/90 bg-white/90 px-6 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    No results found
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {filterActive
                      ? 'Adjust tag filters, switch Any / All, or clear your search.'
                      : 'No ideas match the current view.'}
                  </p>
                </div>
              )}
              {!hasIdeas && (
                <div className="panel empty-state">
                  <h3>No ideas yet</h3>
                  <p>Be the first to add an idea and let AI help shape it.</p>
                </div>
              )}

              {pagination && pagination.total_pages > 0 && (
                <PaginationBar
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  disabled={loading}
                  className="mt-4"
                />
              )}
            </div>
          )}
        </section>
      </section>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </main>
  )
}

export default IdeaBoardPage
