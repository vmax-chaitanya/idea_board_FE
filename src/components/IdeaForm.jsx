import { useState } from 'react'
import TagInput from './TagInput'

const initialState = {
  title: '',
  description: '',
}

const inputClass =
  'mt-1.5 w-full rounded-xl border border-slate-200/90 bg-white/95 px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500'

const labelClass =
  'text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

function IdeaForm({
  onSubmit,
  isSubmitting,
  isGenerating,
  tagSuggestions = [],
}) {
  const [formData, setFormData] = useState(initialState)
  const [tags, setTags] = useState([])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags,
    }

    if (!payload.title || !payload.description) return

    const result = await onSubmit(payload)
    if (result?.success) {
      setFormData(initialState)
      setTags([])
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
        Submit a new idea
      </h2>

      <label className={labelClass} htmlFor="title">
        Title
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="AI study planner for students"
          className={inputClass}
          required
        />
      </label>

      <label className={labelClass} htmlFor="description">
        Description
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your idea and who it helps..."
          className={`${inputClass} min-h-[118px] resize-y`}
          required
        />
      </label>

      <TagInput
        label="Tags"
        value={tags}
        onChange={setTags}
        suggestions={tagSuggestions}
        maxTags={15}
        disabled={isSubmitting}
        hint="Press Enter or comma to add. Backspace removes the last tag."
        placeholder="e.g. ai, productivity…"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
      >
        {isSubmitting ? 'Submitting...' : 'Create Idea'}
      </button>

      {isGenerating && (
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Generating AI suggestion...
        </p>
      )}
    </form>
  )
}

export default IdeaForm
