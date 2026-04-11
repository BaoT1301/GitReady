import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

const THEME_KEY = 'gitready_theme'

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  const isDark = theme === 'dark'

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'rounded-full px-4 py-2 text-sm font-medium transition',
      isActive
        ? 'bg-slate-900 text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950'
        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700/80',
    ].join(' ')

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-lg dark:border-slate-700/70 dark:bg-slate-950/65">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="group inline-flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-xs font-bold text-white shadow">
            GR
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 transition dark:text-slate-100 dark:group-hover:text-cyan-300">
            GitReady
          </span>
        </NavLink>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/70 p-1 dark:border-slate-700 dark:bg-slate-800/80">
            <NavLink to="/modules" className={linkClass}>
              Modules
            </NavLink>
            <NavLink to="/progress" className={linkClass}>
              Progress
            </NavLink>
          </div>

          <button
            onClick={toggleTheme}
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Dark mode toggle"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-2 text-xs font-semibold tracking-wide text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700"
          >
            <span className="pl-1">{isDark ? 'Dark: On' : 'Dark: Off'}</span>
            <span
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                isDark ? 'bg-cyan-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                  isDark ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}
