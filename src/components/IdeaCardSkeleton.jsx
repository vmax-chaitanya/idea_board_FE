function IdeaCardSkeleton() {
  return (
    <article className="idea-card skeleton-card" aria-hidden="true">
      <div className="skeleton-line skeleton-lg" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-sm" />
      <div className="tag-list">
        <span className="skeleton-pill" />
        <span className="skeleton-pill" />
        <span className="skeleton-pill" />
      </div>
      <div className="skeleton-box" />
    </article>
  )
}

export default IdeaCardSkeleton
