import { Link } from 'react-router-dom'
import { modules } from '../data/modules'
import { useProgress } from '../context/ProgressContext'

export default function Progress() {
  const { isModuleComplete, isLessonComplete, quizScores, completedModules, resetProgress } = useProgress()

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const doneLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter(l => isLessonComplete(m.id, l.id)).length,
    0,
  )

  const lessonProgress = totalLessons === 0 ? 0 : Math.round((doneLessons / totalLessons) * 100)

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/65">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Progress</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {doneLessons}/{totalLessons} lessons done, {completedModules.length}/{modules.length} modules complete
            </p>
          </div>
          {completedModules.length > 0 && (
            <button
              onClick={() => confirm('Reset all progress?') && resetProgress()}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
            >
              Reset
            </button>
          )}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span>Lesson completion</span>
            <span>{lessonProgress}%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all dark:from-cyan-400 dark:to-indigo-400"
              style={{ width: `${lessonProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {modules.map(m => {
          const done = isModuleComplete(m.id)
          const lessonsDone = m.lessons.filter(l => isLessonComplete(m.id, l.id)).length
          const score = quizScores[m.id]

          return (
            <Link
              key={m.id}
              to={`/modules/${m.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/85 px-4 py-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/65 dark:hover:border-slate-600 dark:hover:shadow-[0_16px_28px_-20px_rgba(34,211,238,0.45)]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{m.icon}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{m.title}</span>
                  {done && (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-300">
                      Complete
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {lessonsDone}/{m.lessons.length} lessons
                  {score !== undefined ? ` | Quiz: ${score}%` : ''}
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-700 dark:text-cyan-300">Open</span>
            </Link>
          )
        })}
      </div>

      {completedModules.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          No modules completed yet.{' '}
          <Link to="/modules" className="font-semibold text-blue-700 hover:text-blue-900 dark:text-cyan-300 dark:hover:text-cyan-200">
            Start learning
          </Link>
          .
        </div>
      )}
    </div>
  )
}
