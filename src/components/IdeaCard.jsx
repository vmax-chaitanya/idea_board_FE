import LikeButton from './LikeButton'
import TagBadge from './TagBadge'
import { formatIdeaTimestamp } from '../utils/date'
import { getTagReactKey } from '../utils/tags'

function IdeaCard({ idea, onLike }) {
  return (
    <article
      className="group rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-md shadow-slate-900/5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-700/90 dark:bg-slate-800/90 dark:shadow-black/30 dark:hover:shadow-indigo-500/5"
    >
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
        {idea.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {idea.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(idea.tags || []).map((tag, index) => (
          <TagBadge key={getTagReactKey(tag, index, idea.id)} tag={tag} />
        ))}
      </div>

      <section className="mt-3 rounded-xl border border-dashed border-indigo-300/60 bg-indigo-50/80 p-3 dark:border-indigo-500/35 dark:bg-indigo-950/40">
        <strong className="text-sm text-indigo-900 dark:text-indigo-200">
          AI suggestion
        </strong>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {idea.aiSuggestion || 'No suggestion generated yet.'}
        </p>
      </section>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 dark:border-slate-600/80">
        <LikeButton
          liked={idea.likedByCurrentUser}
          count={idea.likes}
          disabled={idea.likedByCurrentUser}
          onLike={() => onLike(idea.id)}
        />
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {formatIdeaTimestamp(idea.createdAt)}
        </span>
      </div>
    </article>
  )
}

export default IdeaCard
