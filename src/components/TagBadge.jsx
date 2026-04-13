import { getTagLabel } from '../utils/tags'

const VARIANT_CLASSES = [
  'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200/90 dark:bg-indigo-950 dark:text-indigo-100 dark:ring-indigo-800/80',
  'bg-violet-100 text-violet-800 ring-1 ring-violet-200/90 dark:bg-violet-950 dark:text-violet-100 dark:ring-violet-800/80',
  'bg-teal-100 text-teal-800 ring-1 ring-teal-200/90 dark:bg-teal-950 dark:text-teal-100 dark:ring-teal-800/80',
  'bg-sky-100 text-sky-800 ring-1 ring-sky-200/90 dark:bg-sky-950 dark:text-sky-100 dark:ring-sky-800/80',
  'bg-amber-100 text-amber-900 ring-1 ring-amber-200/90 dark:bg-amber-950 dark:text-amber-100 dark:ring-amber-800/80',
]

function TagBadge({ tag }) {
  const label = getTagLabel(tag)
  const idx =
    ((label.length % VARIANT_CLASSES.length) + VARIANT_CLASSES.length) %
    VARIANT_CLASSES.length

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold transition-colors duration-200 ${VARIANT_CLASSES[idx]}`}
    >
      #{label || 'tag'}
    </span>
  )
}

export default TagBadge
