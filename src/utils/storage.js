const USER_KEY = 'idea-board-user-id'
const LIKED_KEY = 'idea-board-liked-map'

export function getOrCreateUserId() {
  const existing = localStorage.getItem(USER_KEY)
  if (existing) return existing

  // Simple browser fingerprint simulation for local demo purposes.
  const generated = `${navigator.userAgent}-${crypto.randomUUID()}`
  localStorage.setItem(USER_KEY, generated)
  return generated
}

export function getLikedIdeaMap() {
  const raw = localStorage.getItem(LIKED_KEY)
  if (!raw) return {}

  try {
    return JSON.parse(raw)
  } catch (_error) {
    return {}
  }
}

export function saveLikedIdeaMap(likedMap) {
  localStorage.setItem(LIKED_KEY, JSON.stringify(likedMap))
}

export function markIdeaLiked(ideaId) {
  const likedMap = getLikedIdeaMap()
  likedMap[ideaId] = true
  saveLikedIdeaMap(likedMap)
}
