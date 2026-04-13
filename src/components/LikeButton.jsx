import { Heart } from 'lucide-react'
import { useCallback, useState } from 'react'

function LikeButton({ liked, count, disabled, onLike }) {
  const [justClicked, setJustClicked] = useState(false)

  const handleClick = useCallback(() => {
    if (disabled) return
    setJustClicked(true)
    globalThis.setTimeout(() => setJustClicked(false), 400)
    onLike()
  }, [disabled, onLike])

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={liked}
        aria-label={liked ? 'Already liked' : 'Like this idea'}
        className={[
          'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-200',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
          justClicked ? 'scale-110' : 'scale-100 active:scale-95',
          liked
            ? 'cursor-not-allowed border-rose-400/50 bg-rose-500/15 text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-400'
            : 'border-slate-200/90 bg-white/90 text-slate-500 hover:border-rose-300 hover:bg-rose-50/80 hover:text-rose-600 dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:border-rose-500/50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400',
          disabled ? 'cursor-not-allowed opacity-60' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Heart
          size={22}
          strokeWidth={liked ? 0 : 2}
          className={`transition-all duration-200 ${liked ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400' : ''}`}
          fill={liked ? 'currentColor' : 'none'}
          aria-hidden
        />
      </button>
      <span className="text-sm font-semibold tabular-nums text-slate-600 dark:text-slate-300">
        {count}
      </span>
    </div>
  )
}

export default LikeButton
