// QUIZ — Sergio
// TODO: score display, explanations, retry button

import { useState } from 'react'
import type { QuizQuestion } from '../data/modules'

interface Props {
  questions: QuizQuestion[]
  onComplete?: (score: number) => void
}

export default function Quiz({ questions, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const correct = questions.filter(q => answers[q.id] === q.correctIndex).length
    const score = Math.round((correct / questions.length) * 100)
    setSubmitted(true)
    onComplete?.(score)
  }

  if (questions.length === 0) {
    return <p className="text-sm text-gray-400">No quiz questions yet.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Quiz</h2>

      {questions.map((q, qi) => (
        <div key={q.id} className="border rounded p-4 space-y-2">
          <p className="text-sm font-medium">{qi + 1}. {q.question}</p>
          <div className="space-y-1">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: oi }))}
                className={`w-full text-left text-sm border rounded px-3 py-2 ${
                  answers[q.id] === oi ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                {String.fromCharCode(65 + oi)}. {opt}
              </button>
            ))}
          </div>
          {/* TODO: show correct/incorrect + explanation after submit — Sergio */}
          {submitted && <p className="text-xs text-gray-500">{q.explanation}</p>}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="px-4 py-2 bg-black text-white text-sm rounded disabled:opacity-40"
        >
          Submit
        </button>
      ) : (
        <p className="text-sm text-gray-600">
          {/* TODO: score summary + retry — Sergio */}
          Submitted!
        </p>
      )}
    </div>
  )
}
