import { useMemo, useState } from 'react'
import { modules } from '../data/modules'
import { useProgress } from '../context/ProgressContext'
import ModuleCard from '../components/ModuleCard'

export default function Modules() {
  const { isModuleComplete, isLessonComplete, quizScores } = useProgress()
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  const filteredModules = useMemo(() => {
    const text = query.trim().toLowerCase()
    return modules.filter(m => {
      const matchesDifficulty = difficulty === 'all' || m.difficulty === difficulty
      const matchesText =
        !text ||
        m.title.toLowerCase().includes(text) ||
        m.description.toLowerCase().includes(text)
      return matchesDifficulty && matchesText
    })
  }, [difficulty, query])

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Learning Modules</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Move from Git basics to collaboration workflows with interactive practice in each lesson.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/65">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search modules..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-cyan-400"
          />
          <div className="flex flex-wrap gap-2">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  difficulty === level
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-800 dark:border-cyan-400 dark:bg-cyan-500/15 dark:text-cyan-200'
                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredModules.map(m => (
          <ModuleCard
            key={m.id}
            module={m}
            completed={isModuleComplete(m.id)}
            quizScore={quizScores[m.id]}
            lessonsCompleted={m.lessons.filter(l => isLessonComplete(m.id, l.id)).length}
          />
        ))}
      </div>

      {filteredModules.length === 0 && (
        <p className="mt-6 rounded-2xl border border-slate-200 bg-white/75 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/55 dark:text-slate-300">
          No modules match your current search/filter.
        </p>
      )}
    </div>
  )
}
