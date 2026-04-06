// PROGRESS PAGE — Kerolos
// TODO: completion badges, visual polish, progress bar

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

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Progress</h1>
        {completedModules.length > 0 && (
          <button
            onClick={() => confirm('Reset all progress?') && resetProgress()}
            className="text-sm text-gray-400 hover:text-black"
          >
            Reset
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500">
        {doneLessons}/{totalLessons} lessons · {completedModules.length}/{modules.length} modules complete
      </p>

      {/* TODO: progress bar + badges — Kerolos */}

      <div className="space-y-2">
        {modules.map(m => {
          const done = isModuleComplete(m.id)
          const lessonsD = m.lessons.filter(l => isLessonComplete(m.id, l.id)).length
          const score = quizScores[m.id]

          return (
            <Link
              key={m.id}
              to={`/modules/${m.id}`}
              className="flex items-center justify-between border rounded px-4 py-3 hover:bg-gray-50 text-sm"
            >
              <div>
                <span className="mr-2">{m.icon}</span>
                <span className={done ? 'font-medium' : 'text-gray-700'}>{m.title}</span>
                <span className="text-gray-400 ml-2">{lessonsD}/{m.lessons.length} lessons</span>
                {score !== undefined && <span className="text-gray-400 ml-2">Quiz: {score}%</span>}
              </div>
              {done && <span className="text-green-600">✓</span>}
            </Link>
          )
        })}
      </div>

      {completedModules.length === 0 && (
        <Link to="/modules" className="inline-block text-sm border rounded px-4 py-2 hover:bg-gray-50">
          Start Learning →
        </Link>
      )}
    </div>
  )
}
