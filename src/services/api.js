import axios from 'axios'

/** Matches Postman collection variable `baseUrl` (default http://localhost:4000). */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
})

function unwrapList(data) {
  if (Array.isArray(data)) return data
  if (data?.ideas && Array.isArray(data.ideas)) return data.ideas
  if (data?.data && Array.isArray(data.data)) return data.data
  return []
}

function unwrapEntity(data) {
  if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    return data.data
  }
  return data
}

function normalizePagination(p) {
  if (p == null || typeof p !== 'object') return null
  return {
    page: Number(p.page) || 1,
    limit: Number(p.limit) || 10,
    total: Number(p.total) || 0,
    total_pages: Number(p.total_pages) || 0,
    has_next: Boolean(p.has_next),
    has_prev: Boolean(p.has_prev),
  }
}

/**
 * Parse GET /ideas response: { success, data: { ideas, pagination } } or legacy shapes.
 */
function parseIdeasResponse(raw) {
  const inner = raw?.data
  if (
    inner &&
    typeof inner === 'object' &&
    !Array.isArray(inner) &&
    Array.isArray(inner.ideas)
  ) {
    return {
      ideas: inner.ideas,
      pagination: normalizePagination(inner.pagination),
    }
  }

  const list = unwrapList(raw)
  return {
    ideas: list,
    pagination:
      list.length > 0
        ? {
            page: 1,
            limit: list.length,
            total: list.length,
            total_pages: 1,
            has_next: false,
            has_prev: false,
          }
        : null,
  }
}

/**
 * GET /ideas — query: tag, page, limit
 */
export async function fetchIdeas(options = {}) {
  const { tag, page = 1, limit } = options
  const params = { page }
  if (limit != null) params.limit = limit
  if (tag && tag !== 'all') {
    params.tag = tag
  }
  const response = await api.get('/ideas', { params })
  return parseIdeasResponse(response.data)
}

/**
 * POST /ideas — body: { title, description, tags }
 */
export async function createIdea(payload) {
  const response = await api.post('/ideas', payload)
  return unwrapEntity(response.data)
}

/**
 * POST /ideas/:id/like — no body in Postman collection.
 */
export async function likeIdea(ideaId) {
  const response = await api.post(`/ideas/${ideaId}/like`)
  return unwrapEntity(response.data)
}
