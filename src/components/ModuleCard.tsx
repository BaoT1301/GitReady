// MODULE CARD — Artigun
// TODO: style this card

import { Link } from 'react-router-dom'
import type { Module } from '../data/modules'

interface Props {
  module: Module
  completed: boolean
  quizScore?: number
}

export default function ModuleCard({ module, completed, quizScore }: Props) {
  return (
    <Link to={`/modules/${module.id}`} className="block border rounded p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <span className="text-xl">{module.icon}</span>
        {completed && <span className="text-sm text-green-600">✓ Done</span>}
      </div>
      <h3 className="font-semibold mt-2">{module.title}</h3>
      <p className="text-sm text-gray-500 mt-1">{module.description}</p>
      <div className="text-xs text-gray-400 mt-2 flex gap-3">
        <span>{module.lessons.length} lessons</span>
        <span>{module.difficulty}</span>
        {quizScore !== undefined && <span>Quiz: {quizScore}%</span>}
      </div>
    </Link>
  )
}
