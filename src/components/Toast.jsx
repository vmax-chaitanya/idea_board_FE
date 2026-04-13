function Toast({ message, type = 'info', onClose }) {
  if (!message) return null

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button type="button" className="button button-ghost" onClick={onClose}>
        Dismiss
      </button>
    </div>
  )
}

export default Toast
