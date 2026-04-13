/**
 * Extracts a user-facing message from an Axios error response.
 * Supports common API shapes: string body, { message }, { error }, validation arrays.
 */
export function getAxiosErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error || typeof error !== 'object') return fallback

  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Cannot reach the server. Check that the API is running and VITE_API_BASE_URL is correct.'
  }

  const status = error.response?.status
  const data = error.response?.data

  if (data == null) {
    if (status === 404) return 'Resource not found.'
    if (status === 401) return 'You are not authorized.'
    if (status === 403) return 'Access denied.'
    if (status >= 500) return 'Server error. Please try again later.'
    return fallback
  }

  if (typeof data === 'string' && data.trim()) return data.trim()

  if (typeof data.message === 'string' && data.message.trim()) return data.message.trim()
  if (Array.isArray(data.message)) {
    const joined = data.message.filter(Boolean).join('. ')
    if (joined) return joined
  }

  if (typeof data.error === 'string' && data.error.trim()) return data.error.trim()

  if (data.errors && typeof data.errors === 'object') {
    const parts = Object.values(data.errors).flat().filter(Boolean)
    if (parts.length) return parts.join('. ')
  }

  if (status >= 400) {
    return fallback
  }

  return fallback
}
