function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle light and dark mode"
      title="Toggle theme"
    >
      <span className={`toggle-knob ${theme === 'dark' ? 'is-dark' : ''}`} />
      <span className="toggle-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}

export default ThemeToggle
