import { Link } from 'react-router-dom'
import type { Module } from '../data/modules'

interface Props {
  module: Module
  completed: boolean
  quizScore?: number
}

const difficultyStyles: Record<Module['difficulty'], string> = {
  beginner: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/70',
  intermediate: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/35 dark:text-amber-300 dark:border-amber-700/70',
  advanced: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/35 dark:text-rose-300 dark:border-rose-700/70',
}

export default function ModuleCard({ module, completed, quizScore }: Props) {
  return (
    <Link
      to={`/modules/${module.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/65 dark:hover:border-slate-600 dark:hover:shadow-[0_20px_35px_-24px_rgba(34,211,238,0.45)]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="text-2xl">{module.icon}</span>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${difficultyStyles[module.difficulty]}`}>
            {module.difficulty}
          </span>
          {completed && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-300">
              Complete
            </span>
          )}
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-800 dark:text-slate-100 dark:group-hover:text-cyan-300">{module.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{module.description}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{module.lessons.length} lessons</span>
        {quizScore !== undefined && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 dark:bg-cyan-950/60 dark:text-cyan-300">Quiz: {quizScore}%</span>}
      </div>
    </Link>
  )
}
