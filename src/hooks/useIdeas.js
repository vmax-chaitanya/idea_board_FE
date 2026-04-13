import { useCallback, useRef, useState } from 'react'
import { createIdea, fetchIdeas, likeIdea } from '../services/api'
import { getAxiosErrorMessage } from '../utils/apiError'
import { getLikedIdeaMap, markIdeaLiked } from '../utils/storage'

function pickLikeCount(source) {
  if (source == null) return null
  const n = Number(
    source.likes ?? source.like_count ?? source.likeCount ?? source.data?.likes ?? source.data?.like_count,
  )
  return Number.isFinite(n) ? n : null
}

function normalizeIdea(idea) {
  const id = idea.id ?? idea._id
  const likes = pickLikeCount(idea)
  return {
    id,
    title: idea.title || '',
    description: idea.description || '',
    tags: Array.isArray(idea.tags) ? idea.tags : [],
    aiSuggestion:
      idea.aiSuggestion ??
      idea.ai_response ??
      idea.ai_suggestion ??
      idea.suggestion ??
      '',
    likes: likes ?? 0,
    likedByCurrentUser: Boolean(idea.likedByCurrentUser),
    createdAt:
      idea.createdAt ?? idea.created_at ?? new Date().toISOString(),
  }
}

export function useIdeas() {
  const [ideas, setIdeas] = useState([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [actionError, setActionError] = useState('')

  const lastTagRef = useRef(undefined)
  const pageRef = useRef(1)

  const reloadIdeas = useCallback(async (options = {}) => {
    setLoading(true)
    setError('')
    try {
      if ('tag' in options) {
        lastTagRef.current = options.tag
      }
      const tag = lastTagRef.current
      const requestPage =
        options.page === undefined ? pageRef.current : options.page

      const { ideas: list, pagination: pag } = await fetchIdeas({
        tag,
        page: requestPage,
        limit: options.limit,
      })

      const normalized = Array.isArray(list) ? list.map(normalizeIdea) : []
      setIdeas(normalized.filter((idea) => idea.id != null))
      setPagination(pag)
      pageRef.current = requestPage
      setPage(requestPage)
    } catch (err) {
      setError(getAxiosErrorMessage(err, 'Could not load ideas.'))
    } finally {
      setLoading(false)
    }
  }, [])

  const submitIdea = useCallback(async (payload) => {
    setActionError('')
    setIsSubmitting(true)
    setIsGenerating(true)
    try {
      await createIdea(payload)
      const { ideas: list, pagination: pag } = await fetchIdeas({
        tag: lastTagRef.current,
        page: 1,
      })
      const normalized = Array.isArray(list) ? list.map(normalizeIdea) : []
      setIdeas(normalized.filter((idea) => idea.id != null))
      setPagination(pag)
      pageRef.current = 1
      setPage(1)
      return { success: true }
    } catch (err) {
      const message = getAxiosErrorMessage(
        err,
        'Failed to create idea. Please try again.',
      )
      setActionError(message)
      return { success: false, message }
    } finally {
      setIsSubmitting(false)
      setIsGenerating(false)
    }
  }, [])

  const likeIdeaById = useCallback(async (ideaId) => {
    const likedMap = getLikedIdeaMap()
    if (likedMap[ideaId]) {
      return {
        success: false,
        reason: 'already-liked',
        message: 'You have already liked this idea.',
      }
    }

    setActionError('')
    try {
      const result = await likeIdea(ideaId)
      markIdeaLiked(ideaId)

      setIdeas((previous) =>
        previous.map((idea) => {
          if (idea.id !== ideaId) return idea
          const fromApi = pickLikeCount(result)
          const nextLikes = fromApi ?? idea.likes + 1
          return {
            ...idea,
            likes: nextLikes,
            likedByCurrentUser: true,
          }
        }),
      )
      return { success: true }
    } catch (err) {
      const message = getAxiosErrorMessage(
        err,
        'Unable to like this idea right now.',
      )
      setActionError(message)
      return { success: false, reason: 'request-failed', message }
    }
  }, [])

  const likedMap = getLikedIdeaMap()
  const ideasWithLikeState = ideas.map((idea) => ({
    ...idea,
    likedByCurrentUser:
      idea.likedByCurrentUser || Boolean(likedMap[idea.id]),
  }))

  return {
    ideas: ideasWithLikeState,
    page,
    pagination,
    loading,
    error,
    actionError,
    clearActionError: () => setActionError(''),
    isSubmitting,
    isGenerating,
    submitIdea,
    likeIdeaById,
    reloadIdeas,
  }
}
