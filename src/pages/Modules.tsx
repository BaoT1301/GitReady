import { modules } from '../data/modules'
import { useProgress } from '../context/ProgressContext'
import ModuleCard from '../components/ModuleCard'

export default function Modules() {
  const { isModuleComplete, quizScores } = useProgress()

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Learning Modules</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Move from Git basics to collaboration workflows with interactive practice in each lesson.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map(m => (
          <ModuleCard
            key={m.id}
            module={m}
            completed={isModuleComplete(m.id)}
            quizScore={quizScores[m.id]}
          />
        ))}
      </div>
    </div>
  )
}
