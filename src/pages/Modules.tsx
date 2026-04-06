import { modules } from '../data/modules'
import { useProgress } from '../context/ProgressContext'
import ModuleCard from '../components/ModuleCard'

export default function Modules() {
  const { isModuleComplete, quizScores } = useProgress()

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Modules</h1>
      <div className="grid gap-4 sm:grid-cols-2">
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
